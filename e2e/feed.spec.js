import { expect, test } from '@playwright/test';
import { register } from './helpers';

test('a new neighbour registers, publishes and likes a post', async ({ page }) => {
  await register(page);

  const content = `Plants de tomates à donner ${Date.now()}`;
  await page.getByPlaceholder(/Quoi de neuf/).fill(content);
  await page.getByRole('button', { name: 'Publier' }).click();

  const post = page.locator('.card', { hasText: content });
  await expect(post).toBeVisible();

  await post.getByRole('button', { name: /J'aime \(0\)/ }).click();
  await expect(post.getByRole('button', { name: /J'aime \(1\)/ })).toBeVisible();
});

test('the feed has no horizontal scroll in 800x600', async ({ page }) => {
  await register(page, { firstName: 'Ines' });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
