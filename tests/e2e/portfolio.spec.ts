import { expect, test } from "@playwright/test";

test("anonymous visitors can navigate the complete public portfolio", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ray Wooler — Applied AI, Systems Architecture/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/I build practical systems/);
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();

  for (const [label, path, heading] of [
    ["About", "/about", "Technical thinking grounded in how work actually happens."],
    ["Services", "/services", "Practical help for systems that need to work in the real world."],
    ["Skills", "/skills", "Capabilities connected to evidence."],
    ["AI & Systems", "/ai-systems", "AI is useful when its job and authority are clear."],
    ["Experience", "/experience", "A career shaped by technology and operational reality."],
    ["Contact", "/contact", "Start with the problem you are trying to solve."],
  ]) {
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: label })
      .click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
});

test("project listings show maturity and open an accessible detail page", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A body of work, shown at its real maturity.",
  );
  await expect(page.getByText("Active Development").first()).toBeVisible();
  await page
    .getByRole("link", { name: /Explore project/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Project details" })).toBeVisible();
});

test("unknown projects return a not-found page and contact form cannot submit", async ({
  page,
}) => {
  const missing = await page.goto("/projects/not-a-real-project");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("That page is not here.");

  await page.goto("/contact");
  await expect(page.getByText("This is a contact-page shell only.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Name" })).toBeDisabled();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeDisabled();
  await expect(
    page.getByRole("textbox", { name: "What would you like to discuss?" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Secure form coming in a later V1 gate" }),
  ).toBeDisabled();
});

test("SEO endpoints and page metadata are present", async ({ page, request }) => {
  await page.goto("/projects/frankai-platform");
  await expect(page).toHaveTitle("FrankAI Platform | Ray Wooler");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://raywooler.online/projects/frankai-platform",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "FrankAI Platform",
  );

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("/projects/frankai-platform");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Sitemap: https://raywooler.online/sitemap.xml");
});

test("mobile navigation is keyboard-operable without a client menu bundle", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator("details.mobile-nav");
  await expect(menu).toBeVisible();
  await menu.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("open", "");
  await menu.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL("/projects");
});
