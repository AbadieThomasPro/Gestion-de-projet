// Audit of every page on Gérard's 800x600 screen: no horizontal scroll, nothing cut on the right,
// and the main action reachable without scrolling.
import { expect, test } from "@playwright/test";
import { register } from "./helpers";

// Elements wider than the screen or going past its right edge
async function overflowing(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const issues = [];
    if (document.documentElement.scrollWidth > width)
      issues.push(`page scrollWidth ${document.documentElement.scrollWidth}`);
    for (const el of document.querySelectorAll("body *")) {
      const box = el.getBoundingClientRect();
      if (box.width && box.right > width + 1)
        issues.push(
          `${el.tagName.toLowerCase()}.${el.className} right=${Math.round(box.right)}`,
        );
    }
    return issues;
  });
}

async function expectFits(page, mainAction) {
  expect(await overflowing(page)).toEqual([]);
  await expect(mainAction).toBeInViewport();
}

test("login page", async ({ page }) => {
  await page.goto("/");
  await expectFits(
    page,
    page.getByRole("button", { name: /Se connecter|Connexion/ }),
  );
});

test("register page", async ({ page }) => {
  await page.goto("/register");
  await expectFits(page, page.getByRole("button", { name: "S'inscrire" }));
});

test("feed with a long post", async ({ page }) => {
  await register(page);
  await page
    .getByPlaceholder(/Quoi de neuf/)
    .fill(`Lien très long ${"https://exemple.fr/".padEnd(300, "a")}`);
  await page.getByRole("button", { name: "Publier" }).click();
  await expect(
    page.locator(".card", { hasText: "Lien très long" }),
  ).toBeVisible();
  await expectFits(page, page.getByRole("button", { name: "Publier" }));
});

test("my profile, in reading and editing mode", async ({ page }) => {
  await register(page, {
    firstName: "Maximilien-Alexandre",
    lastName: "De La Fontaine-Beaumarchais",
  });
  await page.locator(".nav-user").click();
  await expectFits(
    page,
    page.getByRole("button", { name: "Modifier le profil" }),
  );

  await page.getByRole("button", { name: "Modifier le profil" }).click();
  expect(await overflowing(page)).toEqual([]);
});
