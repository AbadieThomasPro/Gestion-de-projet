// Updates the "Status" of the issue linked to the branch (ex: feature/12-login -> issue #12)
// in the GitHub Project (https://github.com/users/Miisterone/projects/5).
const { PROJECT_TOKEN, PROJECT_OWNER, PROJECT_NUMBER, REPOSITORY, BRANCH, STATUS } = process.env;

// Name of the single-select field in the project
const STATUS_FIELD = 'Status';

if (!PROJECT_TOKEN) {
  console.log('PROJECT_TOKEN secret is missing, nothing to do');
  process.exit(0);
}

const match = BRANCH.match(/^(?:feature|fix|hotfix)\/(\d+)-/i);
if (!match) {
  console.log(`No issue number in branch "${BRANCH}"`);
  process.exit(0);
}
const issueNumber = Number(match[1]);
const [owner, repo] = REPOSITORY.split('/');

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${PROJECT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    process.exit(1);
  }
  return json.data;
}

// 1. Project, its Status field and the options
const { user } = await graphql(
  `query($owner: String!, $number: Int!, $field: String!) {
    user(login: $owner) {
      projectV2(number: $number) {
        id
        field(name: $field) { ... on ProjectV2SingleSelectField { id options { id name } } }
      }
    }
  }`,
  { owner: PROJECT_OWNER, number: Number(PROJECT_NUMBER), field: STATUS_FIELD },
);
const project = user.projectV2;
const option = project.field?.options.find((o) => o.name === STATUS);
if (!option) {
  console.error(`Option "${STATUS}" not found in field "${STATUS_FIELD}"`);
  process.exit(1);
}

// 2. Issue and its item in the project (added if missing)
const { repository } = await graphql(
  `query($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $number) { id projectItems(first: 20) { nodes { id project { id } } } }
    }
  }`,
  { owner, repo, number: issueNumber },
);
const issue = repository.issue;
if (!issue) {
  console.log(`Issue #${issueNumber} not found`);
  process.exit(0);
}
let itemId = issue.projectItems.nodes.find((n) => n.project.id === project.id)?.id;
if (!itemId) {
  const added = await graphql(
    `mutation($project: ID!, $content: ID!) {
      addProjectV2ItemById(input: { projectId: $project, contentId: $content }) { item { id } }
    }`,
    { project: project.id, content: issue.id },
  );
  itemId = added.addProjectV2ItemById.item.id;
}

// 3. Update the status
await graphql(
  `mutation($project: ID!, $item: ID!, $field: ID!, $option: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $project, itemId: $item, fieldId: $field, value: { singleSelectOptionId: $option }
    }) { projectV2Item { id } }
  }`,
  { project: project.id, item: itemId, field: project.field.id, option: option.id },
);
console.log(`Issue #${issueNumber} -> ${STATUS}`);
