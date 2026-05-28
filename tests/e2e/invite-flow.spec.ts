import { prisma } from "../../lib/prisma";

import {
  createPngFixtureForTest,
  expect,
  test,
} from "./fixtures";

test.describe("Invite and onboarding flow", () => {
  test("shows friendly UI when token is missing", async ({ page }) => {
    await page.goto("/reset-password");

    await expect(page.getByRole("heading", { name: "Missing token" })).toBeVisible();
  });

  test("shows invalid token message for fake token", async ({ page }) => {
    await page.route("**/api/validate-token**", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ valid: false, reason: "invalid" }),
      });
    });

    await page.goto("/reset-password?token=fake-token&mode=invite");

    await expect(page.getByRole("heading", { name: "Invalid token" })).toBeVisible();
  });

  test("shows expired token message when API returns 410", async ({ page }) => {
    await page.route("**/api/validate-token**", async (route) => {
      await route.fulfill({
        status: 410,
        contentType: "application/json",
        body: JSON.stringify({ valid: false, reason: "expired" }),
      });
    });

    await page.goto("/reset-password?token=will-expire&mode=invite");

    await expect(page.getByRole("heading", { name: "Invite expired" })).toBeVisible();
  });

  test("completes invite activation, uploads a profile image, and persists onboarding state", async ({
    page,
    seeded,
  }, testInfo) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("e2eLocalImagePreview", "1");
    });

    await page.goto(`/reset-password?token=${seeded.onboardingToken}&mode=invite`);

    await expect(page.getByRole("heading", { name: "Activate Account" })).toBeVisible();

    await page.getByPlaceholder("New password").fill(seeded.invitedDealer.password);
    await page.getByPlaceholder("Confirm password").fill(seeded.invitedDealer.password);
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.request().method() === "POST" &&
          response.url().includes("/api/auth/callback/credentials")
      ),
      page.getByRole("button", { name: "Continue" }).click(),
    ]);

    await page.goto("/dealer/onboarding/profile", { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/dealer\/onboarding\/profile$/);
    await expect(page.getByRole("heading", { name: "Complete your dealer profile" })).toBeVisible();

    const imagePath = await createPngFixtureForTest(testInfo, "dealer-avatar.png");
    await page.locator('input[type="file"]').setInputFiles(imagePath);

    await expect(page.getByAltText("Uploaded preview")).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder("Company name").fill("Invited Dealer Enterprise");
    await page.getByPlaceholder("Business details (GST, licenses, etc.)").fill("GSTIN 27AAAAA0000A1Z5");
    await page.getByPlaceholder("Address").fill("Andheri East, Mumbai");
    await page.getByPlaceholder("Service regions (comma-separated pincodes or cities)").fill("400069,400070");
    await page.getByPlaceholder("Phone").fill("9000000009");
    await page.getByPlaceholder("City").fill("Mumbai");
    await page.getByPlaceholder("State").fill("Maharashtra");

    await page.getByRole("button", { name: "Complete Profile" }).click();

    await page.waitForURL(/\/dealer$/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dealer$/);
    await expect(page.getByRole("heading", { name: /Welcome back, Invited Dealer/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "active" })).toBeVisible();

    const dealer = await prisma.dealer.findUnique({
      where: { email: seeded.invitedDealer.email },
    });

    const user = await prisma.user.findUnique({
      where: { email: seeded.invitedDealer.email },
    });

    expect(dealer?.onboardingStatus).toBe("ACTIVE");
    expect(dealer?.profileCompletedAt).not.toBeNull();
    expect(dealer?.companyName).toBe("Invited Dealer Enterprise");
    expect(dealer?.serviceRegions).toBe("400069,400070");
    expect(user?.image).toBeTruthy();
  });
});