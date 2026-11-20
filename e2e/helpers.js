// Creates an account through the register page and lands on the feed
export async function register(page, { firstName = 'Gérard', lastName = 'Martin', zone = 'Saint-Michel (Toulouse)' } = {}) {
  const email = `user-${Date.now()}-${Math.floor(Math.random() * 1e6)}@e2e.dev`;

  await page.goto('/register');
  await page.getByPlaceholder('Prénom').fill(firstName);
  await page.getByPlaceholder('Nom', { exact: true }).fill(lastName);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder(/Mot de passe/).fill('secret1');
  await page.getByLabel('Mon quartier').selectOption(zone);
  await page.getByRole('button', { name: "S'inscrire" }).click();

  return { email };
}
