import { expect, test } from '@playwright/test';
import { register } from './helpers';

test('a neighbour chooses their zone at registration and sees it on their profile', async ({ page }) => {
  await register(page, { firstName: 'Karim', lastName: 'Haddad', zone: 'Les Carmes (Toulouse)' });

  await page.getByRole('link', { name: /Karim/ }).first().click();

  await expect(page.getByText('Quartier : Les Carmes')).toBeVisible();
});

test('the register form fits in 800x600 with the zone list', async ({ page }) => {
  await page.goto('/register');

  const button = page.getByRole('button', { name: "S'inscrire" });
  await expect(page.getByLabel('Mon quartier')).toBeVisible();
  await expect(button).toBeInViewport();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
