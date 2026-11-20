import { expect, test } from '@playwright/test';
import { register } from './helpers';

// Value of a datetime-local input, one week from now
function nextWeek() {
  const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  date.setHours(19, 30, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

test('a neighbour creates an event, seen in their neighbourhood only', async ({ page }) => {
  const title = `Fête des voisins ${Date.now()}`;

  await register(page, { firstName: 'Karim', zone: 'Saint-Michel (Toulouse)' });
  await page.getByRole('link', { name: 'Événements' }).click();

  await page.getByLabel('Titre').fill(title);
  await page.getByLabel('Date et heure').fill(nextWeek());
  await page.getByLabel('Lieu de rendez-vous').fill('Place du Salin');
  await page.getByLabel('Description').fill('Chacun apporte un plat.');
  await page.getByRole('button', { name: "Créer l'événement" }).click();

  const card = page.locator('.event-card', { hasText: title });
  await expect(card).toBeVisible();
  await expect(card).toContainText('Place du Salin');
  await expect(page.getByLabel('Titre')).toHaveValue('');

  // A neighbour of the same zone sees it
  await page.getByRole('button', { name: 'Déconnexion' }).click();
  await register(page, { firstName: 'Gérard', zone: 'Saint-Michel (Toulouse)' });
  await page.getByRole('link', { name: 'Événements' }).click();
  await expect(page.locator('.event-card', { hasText: title })).toBeVisible();

  // A user of another zone does not
  await page.getByRole('button', { name: 'Déconnexion' }).click();
  await register(page, { firstName: 'Chloé', zone: 'Saint-Cyprien (Toulouse)' });
  await page.getByRole('link', { name: 'Événements' }).click();
  await expect(page.getByRole('heading', { name: 'Événements à venir' })).toBeVisible();
  await expect(page.locator('.event-card', { hasText: title })).toHaveCount(0);
});
