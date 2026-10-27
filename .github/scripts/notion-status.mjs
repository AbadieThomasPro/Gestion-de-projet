// Updates the status of the Notion ticket linked to the branch (ex: feature/FB-12-login)
const { NOTION_TOKEN, NOTION_DATABASE_ID, BRANCH, STATUS } = process.env;

// Names of the columns in the Notion database
const ID_PROPERTY = 'ID';
const STATUS_PROPERTY = 'Statut';

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.log('Notion secrets are missing, nothing to do');
  process.exit(0);
}

const match = BRANCH.match(/FB-(\d+)/i);
if (!match) {
  console.log(`No ticket id in branch "${BRANCH}"`);
  process.exit(0);
}

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

const search = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    filter: { property: ID_PROPERTY, unique_id: { equals: Number(match[1]) } },
  }),
});
const { results } = await search.json();

if (!results || results.length === 0) {
  console.log(`Ticket FB-${match[1]} not found in Notion`);
  process.exit(0);
}

const update = await fetch(`https://api.notion.com/v1/pages/${results[0].id}`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({
    properties: { [STATUS_PROPERTY]: { status: { name: STATUS } } },
  }),
});

if (!update.ok) {
  console.error(await update.text());
  process.exit(1);
}
console.log(`Ticket FB-${match[1]} -> ${STATUS}`);
