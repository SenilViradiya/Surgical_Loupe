import { prisma } from "../../lib/prisma";

import {
  expect,
  loginWithUi,
  test,
} from "./fixtures";

test.describe("Auth and role redirects", () => {
  test.describe.configure({ timeout: 60_000 });

  test("admin and dealer log in and are routed to their own areas", async ({
    page,
    seeded,
  }) => {
    await loginWithUi(page, seeded.admin.email, seeded.admin.password);

    await page.goto("/admin", { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await page.context().clearCookies();

    await loginWithUi(page, seeded.testDealerProfile.email, seeded.testDealerProfile.password);

    await page.goto("/dealer", { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/dealer$/);
    await expect(page.getByRole("heading", { name: /Welcome back, Active Dealer/i })).toBeVisible();

    await page.goto("/admin", { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/dealer$/);
  });

  test("reset password flow updates the password and allows the new login", async ({
    page,
    seeded,
  }) => {
    await page.goto(`/reset-password?token=${seeded.resetPasswordToken}`);

    await expect(page.getByRole("heading", { name: "Reset Password" })).toBeVisible();

    await page.getByPlaceholder("New password").fill(seeded.resetUser.newPassword);
    await page.getByPlaceholder("Confirm password").fill(seeded.resetUser.newPassword);
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL(/\/login$/, { timeout: 10_000 });

    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { token: seeded.resetPasswordToken },
    });

    expect(tokenRecord).toBeNull();

    await loginWithUi(page, seeded.resetUser.email, seeded.resetUser.newPassword);

    await page.goto("/login", { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/$/);
  });

  test("unauthenticated users are redirected out of protected areas", async ({
    page,
  }) => {
    await page.goto("/dealer");
    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login$/);
  });
});
