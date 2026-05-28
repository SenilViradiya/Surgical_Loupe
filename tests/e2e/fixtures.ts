import "dotenv/config";

import bcrypt from "bcryptjs";

import {
  expect,
  test as base,
  type Page,
  type TestInfo,
} from "@playwright/test";

import { prisma } from "../../lib/prisma";
import { resetRateLimits } from "../../lib/rate-limit";
import {
  DealerOnboardingStatus,
  ProductStatus,
  UserRole,
} from "../../lib/generated/prisma";

type SeededData = {
  admin: {
    email: string;
    password: string;
  };
  onboardingToken: string;
  invitedDealer: {
    name: string;
    email: string;
    password: string;
    inviteToken: string;
  };
  testDealerProfile: {
    name: string;
    email: string;
    password: string;
  };
  resetUser: {
    name: string;
    email: string;
    password: string;
    newPassword: string;
    resetToken: string;
  };
  resetPasswordToken: string;
  uploadedImageUrl: string;
};

const passwords = {
  admin: "Admin!2345",
  dealer: "Dealer!2345",
  activeDealer: "ActiveDealer!2345",
  resetUser: "ResetUser!2345",
  resetUserNew: "ResetUser!6789",
};

const tokens = {
  invite: "invite-token-seeded-dealer",
  reset: "reset-token-seeded-user",
};

const fixtureImageUrl = "https://example.com/test/dealer-avatar.png";

const inviteExpiresAt = new Date("2030-01-01T00:00:00.000Z");
const resetExpiresAt = new Date("2030-01-02T00:00:00.000Z");
const profileCompletedAt = new Date("2030-01-03T00:00:00.000Z");

export const e2eData = {
  passwords,
  tokens,
  fixtureImageUrl,
};

async function clearDatabase() {
  resetRateLimits();

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Session",
      "Account",
      "VerificationToken",
      "Lead",
      "Configuration",
      "DealerCoverage",
      "Dealer",
      "User",
      "Frame",
      "Lens",
      "Headlight",
      "Event",
      "ActivityLog"
    RESTART IDENTITY CASCADE;
  `);
}

async function createPasswordHash(password: string) {
  return bcrypt.hash(password, 10);
}

export async function seedE2EData(): Promise<SeededData> {
  await clearDatabase();

  const [adminPassword, dealerPassword, activeDealerPassword, resetPassword] =
    await Promise.all([
      createPasswordHash(passwords.admin),
      createPasswordHash(passwords.dealer),
      createPasswordHash(passwords.activeDealer),
      createPasswordHash(passwords.resetUser),
    ]);

  const adminEmail = "admin@test.local";
  const invitedDealerEmail = "invited-dealer@test.local";
  const activeDealerEmail = "active-dealer@test.local";
  const resetUserEmail = "reset-user@test.local";

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: adminEmail,
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: "Invited Dealer",
      email: invitedDealerEmail,
      password: null,
      role: UserRole.DEALER,
    },
  });

  await prisma.user.create({
    data: {
      name: "Active Dealer",
      email: activeDealerEmail,
      password: activeDealerPassword,
      role: UserRole.DEALER,
    },
  });

  await prisma.user.create({
    data: {
      name: "Reset User",
      email: resetUserEmail,
      password: resetPassword,
      role: UserRole.USER,
    },
  });

  await prisma.dealer.create({
    data: {
      name: "Invited Dealer",
      email: invitedDealerEmail,
      phone: "9000000001",
      city: "Pune",
      state: "Maharashtra",
      onboardingStatus: DealerOnboardingStatus.INVITED,
      inviteToken: tokens.invite,
      inviteTokenExpiresAt: inviteExpiresAt,
      isActive: false,
    },
  });

  await prisma.dealer.create({
    data: {
      name: "Active Dealer",
      email: activeDealerEmail,
      phone: "9000000002",
      city: "Mumbai",
      state: "Maharashtra",
      onboardingStatus: DealerOnboardingStatus.ACTIVE,
      isActive: true,
      companyName: "Active Vision Care",
      businessDetails: "GSTIN 27AAACT0000A1Z5",
      address: "Bandra West, Mumbai",
      serviceRegions: "400050,400051",
      profileCompletedAt,
    },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: invitedDealerEmail,
      token: tokens.invite,
      expires: inviteExpiresAt,
    },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: resetUserEmail,
      token: tokens.reset,
      expires: resetExpiresAt,
    },
  });

  await prisma.frame.create({
    data: {
      name: "Atlas Frame",
      slug: "atlas-frame",
      description: "Precision frame for the configurator e2e seed.",
      modelUrl: "/models/frame.glb",
      thumbnailUrl: "/images/frame.png",
      price: 1200,
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.lens.create({
    data: {
      name: "Precision Lens",
      slug: "precision-lens",
      description: "Compatible lens for seeded onboarding tests.",
      modelUrl: "/models/lens.glb",
      thumbnailUrl: "/images/lens.png",
      magnification: "2.5x",
      price: 500,
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.headlight.create({
    data: {
      name: "Beam Headlight",
      slug: "beam-headlight",
      description: "Seeded light accessory for coverage.",
      modelUrl: "/models/headlight.glb",
      thumbnailUrl: "/images/headlight.png",
      price: 900,
      status: ProductStatus.ACTIVE,
    },
  });

  return {
    admin: {
      email: adminEmail,
      password: passwords.admin,
    },
    onboardingToken: tokens.invite,
    invitedDealer: {
      name: "Invited Dealer",
      email: invitedDealerEmail,
      password: passwords.dealer,
      inviteToken: tokens.invite,
    },
    testDealerProfile: {
      name: "Active Dealer",
      email: activeDealerEmail,
      password: passwords.activeDealer,
    },
    resetUser: {
      name: "Reset User",
      email: resetUserEmail,
      password: passwords.resetUser,
      newPassword: passwords.resetUserNew,
      resetToken: tokens.reset,
    },
    resetPasswordToken: tokens.reset,
    uploadedImageUrl: fixtureImageUrl,
  };
}

export async function cleanupE2EData() {
  await clearDatabase();
}

export const test = base.extend<{ seeded: SeededData }>({
  seeded: [
    async ({}, use) => {
      const seeded = await seedE2EData();

      try {
        await use(seeded);
      } finally {
        await cleanupE2EData();
      }
    },
    { auto: true },
  ],
});

export { expect };

export async function loginWithUi(
  page: Page,
  email: string,
  password: string
) {
  await page.goto("/login");
  await page.getByPlaceholder("john@example.com").fill(email);
  await page.getByPlaceholder("******").fill(password);
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/api/auth/callback/credentials")
    ),
    page.getByRole("button", { name: "Login" }).click(),
  ]);
}

export async function createPngFixtureForTest(
  testInfo: TestInfo,
  fileName: string
) {
  const filePath = testInfo.outputPath(fileName);
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2Xn6kAAAAASUVORK5CYII=",
    "base64"
  );

  const { writeFile } = await import("fs/promises");
  await writeFile(filePath, png);

  return filePath;
}