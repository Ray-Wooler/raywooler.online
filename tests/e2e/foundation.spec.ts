import { expect, test } from "@playwright/test";

test("the foundation shell responds with its V1 boundary", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("raywooler.online | V1 Foundation");
  await expect(page.getByRole("heading", { name: "raywooler.online" })).toBeVisible();
  await expect(page.getByText("Portfolio features begin after Gate 1 is accepted.")).toBeVisible();
});
