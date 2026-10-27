// Generates docs/API.md from the API routes of the backend
import fs from 'fs';
import path from 'path';

const API_DIR = 'backend/app/api';
const OUTPUT = 'docs/API.md';

function findRoutes(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(findRoutes(fullPath));
    else if (entry.name === 'route.js') files.push(fullPath);
  }
  return files;
}

const rows = [];

for (const file of findRoutes(API_DIR).sort()) {
  const code = fs.readFileSync(file, 'utf-8');
  const url = '/api/' + path.relative(API_DIR, path.dirname(file)).split(path.sep).join('/');
  const needsAuth = code.includes('getUserId(') ? 'Oui' : 'Non';

  // Finds "// comment" (optional) followed by "export function GET"
  const regex = /(?:\/\/ (.*)\n)?export (?:async )?function (GET|POST|PUT|DELETE)/g;
  for (const match of code.matchAll(regex)) {
    rows.push(`| ${match[2]} | \`${url}\` | ${needsAuth} | ${match[1] || ''} |`);
  }
}

const content = `# Documentation de l'API

> Fichier généré automatiquement par \`npm run docs\`, ne pas modifier à la main.

Les routes protégées attendent le header \`Authorization: Bearer <token>\`.

| Méthode | Route | Connexion | Description |
|---|---|:-:|---|
${rows.join('\n')}
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, content);
console.log(`${OUTPUT} : ${rows.length} routes`);
