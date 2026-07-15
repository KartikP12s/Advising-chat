import { expect, test } from "@playwright/test";

test("key screens render without framework overlays", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("landing.png"), fullPage: true });

  await page.goto("/research");
  await expect(page.getByRole("heading", { name: /Trust operations/ })).toBeVisible();
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("research.png"), fullPage: true });
});
