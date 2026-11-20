// Imports the backlog of docs/backlog/sprint-*.md into GitHub:
// one issue per EPIC, US and task, sub-issues for the hierarchy, "blocked by" dependencies,
// and the fields Status / Sprint / Rôle / Estimation of the GitHub Project.
//
//   node scripts/migrate-backlog.mjs              -> dry run, prints what would be created
//   GITHUB_TOKEN=$(gh auth token) node scripts/migrate-backlog.mjs --apply
//
// The token needs the "repo" and "project" scopes (gh auth refresh -s project).
// Safe to re-run: an issue already created (marker <!-- LL-xxx --> in its body) is reused.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'Miisterone/Gestion-de-projet';
const PROJECT_OWNER = 'Miisterone';
const PROJECT_NUMBER = 5;
const DIR = new URL('../docs/backlog/', import.meta.url).pathname;
const APPLY = process.argv.includes('--apply');
const TOKEN = process.env.GITHUB_TOKEN;

const STATUS = { '✅': 'Terminé', '🟡': 'À faire', '♻️': 'À faire', '⬜': 'À faire' };
const STATE_LABEL = { '🟡': 'partiel', '♻️': 'à-reprendre' };

// ---------- 1. Parse the markdown backlog ----------
const tickets = new Map(); // LL-id -> ticket
const ids = (text) => {
  const out = [];
  for (const m of text.matchAll(/LL-(\d+)(?:\s*à\s*LL-(\d+))?/g)) {
    const from = Number(m[1]);
    const to = m[2] ? Number(m[2]) : from;
    for (let i = from; i <= to; i++) out.push(`LL-${i}`);
  }
  return out;
};
const ticket = (id) => {
  if (!tickets.has(id)) tickets.set(id, { id, notes: [], dependsOn: [] });
  return tickets.get(id);
};

for (const file of readdirSync(DIR).filter((f) => /^sprint-\d+\.md$/.test(f)).sort()) {
  const sprint = `Sprint ${file.match(/\d+/)[0]}`;
  let section = '';
  let epic = null;
  for (const line of readFileSync(join(DIR, file), 'utf8').split('\n')) {
    if (line.startsWith('## ')) section = line.slice(3).trim();

    // Task row: | # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
    const row = line.match(/^\|\s*\d+\s*\|\s*(LL-\d+)\s*\|(.+)\|$/);
    if (row) {
      const [title, parent, roles, days, deps, status] = row[2].split('|').map((c) => c.trim());
      Object.assign(ticket(row[1]), {
        type: 'Tâche',
        title: title.replace(/^Bug\s*:\s*/, ''),
        bug: /^Bug\s*:/.test(title),
        parent: parent.startsWith('LL-') ? parent : null,
        roles: roles.split(',').map((r) => r.trim()),
        estimate: Number(days.replace(',', '.')),
        dependsOn: ids(deps),
        symbol: status,
        sprint,
      });
      continue;
    }

    if (section === 'Structure') {
      // - **LL-199 EPIC Outillage** (1/2) : ...   |   - LL-200 US Documentation : ...
      const m = line.match(/^(\s*)- (\*\*)?(LL-\d+) (?:(EPIC|US) )?(.+)$/);
      if (!m || (!m[2] && !m[4])) continue;
      const title = m[5].replace(/\*\*.*$/, '').replace(/\s*(\(\d+\/\d+\))?\s*(:.*)?$/, '').trim();
      const t = ticket(m[3]);
      t.type = m[4] === 'US' ? 'US' : 'EPIC';
      t.title ??= title;
      t.sprint ??= sprint;
      if (t.type === 'US' && m[1].length > 0 && epic) t.parent = epic;
      if (t.type === 'EPIC') epic = m[3];
      continue;
    }

    if (section === 'Notes' && line.startsWith('- ')) {
      for (const id of ids(line.match(/^- \*\*([^*]+)\*\*/)?.[1] ?? '')) ticket(id).notes.push(line.slice(2));
    }
  }
}

const all = [...tickets.values()].filter((t) => t.type);
const order = { EPIC: 0, US: 1, 'Tâche': 2 };
all.sort((a, b) => order[a.type] - order[b.type] || Number(a.id.slice(3)) - Number(b.id.slice(3)));

const labelsOf = (t) => {
  const labels = [];
  if (t.type === 'EPIC') labels.push('epic');
  if (t.type === 'US') labels.push('user-story');
  if (t.bug) labels.push('bug');
  if (STATE_LABEL[t.symbol]) labels.push(STATE_LABEL[t.symbol]);
  for (const r of t.roles ?? []) {
    if (r === 'Dev Web') labels.push('frontend');
    if (r === 'Dev Backend') labels.push('backend');
    if (r === 'Stagiaire') labels.push('stagiaire');
  }
  return [...new Set(labels)];
};
const statusOf = (t) =>
  t.type === 'Tâche' ? STATUS[t.symbol] ?? 'Backlog' : 'Backlog';

console.log(`${all.length} tickets: ${all.filter((t) => t.type === 'EPIC').length} EPIC, ` +
  `${all.filter((t) => t.type === 'US').length} US, ${all.filter((t) => t.type === 'Tâche').length} tâches`);
if (!APPLY) {
  for (const t of all) {
    console.log(`${t.id.padEnd(7)} ${t.type.padEnd(5)} ${t.sprint} | ${statusOf(t).padEnd(8)} | ` +
      `parent ${t.parent ?? '-'} | deps ${t.dependsOn.join(',') || '-'} | [${labelsOf(t)}] ${t.title}`);
  }
  console.log('\nDry run. Add --apply (with GITHUB_TOKEN) to create the issues.');
  process.exit(0);
}
if (!TOKEN) throw new Error('GITHUB_TOKEN is missing');

// ---------- 2. GitHub helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function rest(method, path, body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' },
    body: body && JSON.stringify(body),
  });
  if (!res.ok && res.status !== 422) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}
async function graphql(query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// ---------- 3. Labels ----------
const COLORS = { epic: '5319e7', 'user-story': '1d76db', bug: 'd73a4a', partiel: 'fbca04',
  'à-reprendre': 'c5def5', stagiaire: 'bfdadc', frontend: '0e8a16', backend: 'b60205' };
for (const [name, color] of Object.entries(COLORS)) await rest('POST', `/repos/${REPO}/labels`, { name, color });

// ---------- 4. Project fields ----------
const fieldsQuery = `query($o: String!, $n: Int!) { user(login: $o) { projectV2(number: $n) { id
  fields(first: 50) { nodes { ... on ProjectV2FieldCommon { id name dataType }
    ... on ProjectV2SingleSelectField { options { id name } } } } } } }`;
let project = (await graphql(fieldsQuery, { o: PROJECT_OWNER, n: PROJECT_NUMBER })).user.projectV2;
const field = (name) => project.fields.nodes.find((f) => f.name === name);

const statusNeeded = ['Backlog', 'À faire', 'En cours', 'En review', 'À tester', 'Terminé'];
const missing = statusNeeded.filter((s) => !field('Status')?.options.some((o) => o.name === s));
if (missing.length) {
  throw new Error(`Add these options to the "Status" field of the project first: ${missing.join(', ')}`);
}
const sprints = [...new Set(all.map((t) => t.sprint))].sort();
const roles = [...new Set(all.flatMap((t) => t.roles ?? []))].sort();
for (const [name, options] of [['Sprint', sprints], ['Rôle', roles]]) {
  if (!field(name)) {
    await graphql(`mutation($p: ID!, $name: String!, $opts: [ProjectV2SingleSelectFieldOptionInput!]) {
      createProjectV2Field(input: { projectId: $p, dataType: SINGLE_SELECT, name: $name, singleSelectOptions: $opts }) { clientMutationId } }`,
    { p: project.id, name, opts: options.map((o) => ({ name: o, color: 'GRAY', description: '' })) });
  }
}
if (!field('Estimation')) {
  await graphql(`mutation($p: ID!) { createProjectV2Field(input: { projectId: $p, dataType: NUMBER, name: "Estimation" }) { clientMutationId } }`,
    { p: project.id });
}
project = (await graphql(fieldsQuery, { o: PROJECT_OWNER, n: PROJECT_NUMBER })).user.projectV2;

async function setField(itemId, name, value) {
  const f = field(name);
  let v;
  if (f.dataType === 'NUMBER') v = { number: value };
  else {
    const opt = f.options.find((o) => o.name === value);
    if (!opt) return console.warn(`  option "${value}" missing in field ${name}`);
    v = { singleSelectOptionId: opt.id };
  }
  await graphql(`mutation($p: ID!, $i: ID!, $f: ID!, $v: ProjectV2FieldValue!) {
    updateProjectV2ItemFieldValue(input: { projectId: $p, itemId: $i, fieldId: $f, value: $v }) { clientMutationId } }`,
  { p: project.id, i: itemId, f: f.id, v });
}

// ---------- 5. Issues (reused when already migrated) ----------
const existing = new Map();
for (let page = 1; ; page++) {
  const list = await rest('GET', `/repos/${REPO}/issues?state=all&per_page=100&page=${page}`);
  for (const i of list) {
    const m = i.body?.match(/<!-- (LL-\d+) -->/);
    if (m && !i.pull_request) existing.set(m[1], i);
  }
  if (list.length < 100) break;
}

const issues = new Map(); // LL-id -> issue
for (const t of all) {
  if (existing.has(t.id)) {
    issues.set(t.id, existing.get(t.id));
    continue;
  }
  const lines = [`<!-- ${t.id} -->`];
  if (t.type === 'Tâche') lines.push(`**Responsable :** ${t.roles.join(', ')}`, `**Estimation :** ${t.estimate} J/H`);
  if (t.notes.length) lines.push('', '### Notes', ...t.notes.map((n) => `- ${n}`));
  const issue = await rest('POST', `/repos/${REPO}/issues`, {
    title: t.type === 'Tâche' ? t.title : `[${t.type}] ${t.title}`,
    body: lines.join('\n'),
    labels: labelsOf(t),
  });
  issues.set(t.id, issue);
  console.log(`#${issue.number} <- ${t.id} ${t.title}`);
  await sleep(1000); // avoid the secondary rate limit on content creation
}
const ref = (id) => (issues.has(id) ? `#${issues.get(id).number}` : id);

// ---------- 6. Hierarchy, dependencies, project fields, state ----------
for (const t of all) {
  const issue = issues.get(t.id);

  if (t.parent && issues.has(t.parent)) {
    await rest('POST', `/repos/${REPO}/issues/${issues.get(t.parent).number}/sub_issues`, { sub_issue_id: issue.id });
  }
  for (const dep of t.dependsOn.filter((d) => issues.has(d))) {
    await rest('POST', `/repos/${REPO}/issues/${issue.number}/dependencies/blocked_by`, { issue_id: issues.get(dep).id });
  }
  // References to old ids in the body -> issue numbers
  const body = issue.body ?? '';
  const newBody = body.replace(/(?<!<!-- )LL-\d+/g, ref) +
    (t.dependsOn.length && !body.includes('**Dépend de :**') ? `\n\n**Dépend de :** ${t.dependsOn.map(ref).join(', ')}` : '');
  if (newBody !== body) await rest('PATCH', `/repos/${REPO}/issues/${issue.number}`, { body: newBody });

  const item = await graphql(`mutation($p: ID!, $c: ID!) { addProjectV2ItemById(input: { projectId: $p, contentId: $c }) { item { id } } }`,
    { p: project.id, c: issue.node_id });
  const itemId = item.addProjectV2ItemById.item.id;
  await setField(itemId, 'Status', statusOf(t));
  await setField(itemId, 'Sprint', t.sprint);
  if (t.roles?.length) await setField(itemId, 'Rôle', t.roles[0]);
  if (t.estimate) await setField(itemId, 'Estimation', t.estimate);

  if (t.symbol === '✅' && issue.state === 'open') {
    await rest('PATCH', `/repos/${REPO}/issues/${issue.number}`, { state: 'closed', state_reason: 'completed' });
  }
}

// ---------- 7. Mapping LL-id -> issue, kept for history ----------
const mapping = Object.fromEntries([...issues].map(([id, i]) => [id, i.number]));
writeFileSync(join(DIR, 'mapping.json'), `${JSON.stringify(mapping, null, 2)}\n`);
console.log(`Done: ${issues.size} issues in https://github.com/users/${PROJECT_OWNER}/projects/${PROJECT_NUMBER}`);
