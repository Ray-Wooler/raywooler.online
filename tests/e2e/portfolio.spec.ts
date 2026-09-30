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

test("admin routes reject anonymous visitors and sign-in enforces origin checks", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sign in to administration.");

  const rejected = await request.post("/api/auth/login", {
    form: { email: "gate3-owner@example.invalid", password: "disposable-ci-test-password-only" },
    maxRedirects: 0,
  });
  expect(rejected.status()).toBe(403);
});

test("owner sign-in creates a protected session and logout-all revokes access", async ({
  page,
}) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    test.skip(true, "CI provisions a disposable owner account for the browser test.");
    return;
  }

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/admin");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Portfolio administration");
  await expect(page.getByText(email, { exact: false })).toBeVisible();

  const cookie = (await page.context().cookies()).find((item) => item.name === "rw_session");
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
  expect(cookie?.secure).toBe(false);

  await page.getByRole("button", { name: "Sign out all sessions" }).click();
  await expect(page).toHaveURL(/\/admin\/login\?revoked=1$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("owner sign-in responses are generic and account attempts are throttled", async ({
  request,
}) => {
  const email = `unknown-${crypto.randomUUID()}@example.invalid`;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await request.post("/api/auth/login", {
      form: { email, password: "deliberately-wrong-password-2026" },
      headers: { Origin: "http://127.0.0.1:3000" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(response.headers().location).toContain("/admin/login?error=1");
  }
  const blocked = await request.post("/api/auth/login", {
    form: { email, password: "deliberately-wrong-password-2026" },
    headers: { Origin: "http://127.0.0.1:3000" },
    maxRedirects: 0,
  });
  expect(blocked.status()).toBe(303);
  expect(blocked.headers().location).toContain("/admin/login?error=1");
});

test("owner creates, reviews, publishes and revises a project without changing source", async ({
  page,
}) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    test.skip(true, "CI provisions a disposable owner account for the browser test.");
    return;
  }
  const slug = `gate4-${crypto.randomUUID().slice(0, 8)}`;
  const title = `Gate 4 verified ${slug}`;
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page
    .getByRole("navigation", { name: "Administration" })
    .getByRole("link", { name: "Content" })
    .click();
  await page.getByLabel("Record fields").fill(
    JSON.stringify(
      {
        title,
        slug,
        summary: "A project created and published through the owner console.",
        problem: "A test should prove the content lifecycle.",
        maturity: "Prototype",
        responsibilities: ["Created through the browser console"],
      },
      null,
      2,
    ),
  );
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page.getByText("DRAFT", { exact: true }).last()).toBeVisible();
  const editor = page.getByLabel("Record fields");
  const record = JSON.parse(await editor.inputValue()) as Record<string, unknown>;
  record.summary = "Edited once through the owner console.";
  await editor.fill(JSON.stringify(record, null, 2));
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/Version 2.*Owner edited content/)).toBeVisible();
  await page.goto("/projects");
  await expect(page.locator(`a[href="/projects/${slug}"]`)).toHaveCount(0);
  await page.goto("/admin/content");
  await page.getByRole("button", { name: `${title} DRAFT` }).click();
  await page.getByRole("button", { name: "Submit for review" }).click();
  await page.getByRole("button", { name: "Approve" }).click();
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  const recordsResponse = await page.request.get("/api/admin/content/projects");
  expect(recordsResponse.ok()).toBe(true);
  const records = (await recordsResponse.json()).items as Array<{
    slug: string;
    publicationStatus: string;
    visibility: string;
  }>;
  expect(records.find((record) => record.slug === slug)).toMatchObject({
    publicationStatus: "PUBLISHED",
    visibility: "PUBLIC",
  });
  await page.goto("/projects");
  const managedProjectLink = page.locator(`a[href="/projects/${slug}"]`);
  await expect(managedProjectLink).toBeVisible();
  await managedProjectLink.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
});
