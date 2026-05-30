import { prisma } from "../../lib/prisma";

import { expect, loginWithUi, test } from "./fixtures";

async function createExtraDealer(email: string, name: string) {
  await prisma.user.create({
    data: {
      name,
      email,
      password: null,
      role: "DEALER",
    },
  });

  return prisma.dealer.create({
    data: {
      name,
      email,
      phone: "9000000111",
      city: "Mumbai",
      state: "Maharashtra",
      onboardingStatus: "ACTIVE",
      isActive: true,
    },
  });
}

async function seedLeadForReassign(seed: any, dealerId: string) {
  const configuration = await prisma.configuration.create({
    data: {
      frameId: seed.catalog.frame.id,
      lensId: seed.catalog.lens.id,
      headlightId: seed.catalog.headlight.id,
    },
  });

  return prisma.lead.create({
    data: {
      fullName: "Notification Lead",
      email: "notification-lead@test.local",
      phone: "9000000999",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      dealerId,
      configurationId: configuration.id,
    },
  });
}

async function createQuoteForDealer(page: any, seed: any) {
  const configuration = await prisma.configuration.create({
    data: {
      frameId: seed.catalog.frame.id,
      lensId: seed.catalog.lens.id,
      headlightId: seed.catalog.headlight.id,
    },
  });

  const lead = await prisma.lead.create({
    data: {
      fullName: "Quote Notification Lead",
      email: "quote-notification@test.local",
      phone: "9000000998",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      dealerId: (await prisma.dealer.findUnique({ where: { email: seed.testDealerProfile.email } }))?.id,
      configurationId: configuration.id,
    },
  });

  const createResponse = await page.request.post("/api/quotes", {
    data: {
      leadId: lead.id,
      notes: "Notification test quote",
      discount: 0,
      tax: 0,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });

  expect(createResponse.status()).toBe(201);
  const createBody = await createResponse.json();

  const sendResponse = await page.request.post(`/api/quotes/${createBody.quote.id}/send`, {
    data: {
      baseUrl: "http://localhost:3001",
    },
  });

  expect(sendResponse.status()).toBe(200);

  return { lead, quote: createBody.quote, accessToken: createBody.accessToken };
}

test.describe("Notification center", () => {
  test.describe.configure({ timeout: 60_000 });

  test("shows lead reassignment in the bell dropdown", async ({ page, seeded }) => {
    const newDealerEmail = `secondary-dealer-${Date.now()}@test.local`;
    const newDealer = await createExtraDealer(newDealerEmail, "Secondary Dealer");

    const lead = await seedLeadForReassign(seeded, (await prisma.dealer.findUnique({ where: { email: seeded.testDealerProfile.email } }))!.id);

    await loginWithUi(page, seeded.admin.email, seeded.admin.password);
    await page.goto(`/admin/leads/${lead.id}`);

    await page.getByLabel("Reassign dealer").selectOption({ label: newDealer.name });
    await page.getByRole("button", { name: "Assign" }).click();

    await expect(page.getByText("Lead reassigned")).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "Notifications" }).click();
    await expect(page.getByText("Lead reassigned")).toBeVisible({ timeout: 10_000 });
  });

  test("shows quote acceptance on the notifications page", async ({ page, seeded }) => {
    await loginWithUi(page, seeded.testDealerProfile.email, seeded.testDealerProfile.password);

    const { quote, accessToken } = await createQuoteForDealer(page, seeded);

    const acceptResponse = await page.request.post(`/api/quotes/${quote.id}/accept`, {
      data: {
        token: accessToken,
        comment: "Ready to proceed",
      },
    });

    expect(acceptResponse.status()).toBe(200);

    await page.goto("/notifications?type=QUOTE&query=accepted");
    await expect(page.getByRole("heading", { name: "Notifications" })).toBeVisible();
    await expect(page.getByText("Quote accepted")).toBeVisible();
  });

  test("shows inventory alerts and marks them read from the notifications page", async ({ page, seeded }) => {
    await loginWithUi(page, seeded.admin.email, seeded.admin.password);

    const adminUser = await prisma.user.findUnique({ where: { email: seeded.admin.email } });

    // Create the notification directly via Prisma for determinism
    await prisma.notification.create({
      data: {
        userId: adminUser!.id,
        title: "Inventory out of stock",
        message: `${seeded.catalog.frame.name} is out of stock.`,
        type: "INVENTORY",
        entityType: "FRAME",
        entityId: seeded.catalog.frame.id,
        deliveryChannel: "IN_APP",
        deliveryStatus: "DELIVERED",
        eventKey: `INVENTORY_OUT_OF_STOCK:FRAME:${seeded.catalog.frame.id}:${adminUser!.id}:e2e`,
      },
    });

    await page.goto("/admin");
    await page.getByRole("button", { name: "Notifications" }).click();
    await expect(page.getByText("Inventory out of stock")).toBeVisible({ timeout: 10_000 });

    await page.goto("/notifications?type=INVENTORY");
    await expect(page.getByText("Inventory out of stock")).toBeVisible();
    await page.getByRole("button", { name: "Mark all read" }).click();

    await expect.poll(async () => {
      const response = await page.request.get("/api/notifications?type=INVENTORY&unreadOnly=true");
      const json = await response.json();
      return json.items.length;
    }, { timeout: 15_000, intervals: [1_000, 2_000, 3_000] }).toBe(0);
  });
});
