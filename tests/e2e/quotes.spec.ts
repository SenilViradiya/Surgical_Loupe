import { prisma } from "../../lib/prisma";

import { expect, test } from "./fixtures";

async function loginAsDealer(page: Parameters<typeof test>[0]["page"], email: string, password: string) {
  const csrfResponse = await page.request.get("/api/auth/csrf");
  const csrfBody = await csrfResponse.json();

  const signInResponse = await page.request.post("/api/auth/callback/credentials", {
    form: {
      csrfToken: csrfBody.csrfToken,
      email,
      password,
      callbackUrl: "/",
      json: "true",
    },
  });

  expect(signInResponse.ok()).toBe(true);
}

async function seedQuoteLead(seeded: any) {
  const dealer = await prisma.dealer.findUnique({ where: { email: seeded.testDealerProfile.email } });

  if (!dealer) {
    throw new Error("Seeded dealer not found");
  }

  const configuration = await prisma.configuration.create({
    data: {
      frameId: seeded.catalog.frame.id,
      lensId: seeded.catalog.lens.id,
      headlightId: seeded.catalog.headlight.id,
    },
  });

  const suffix = Date.now();
  const lead = await prisma.lead.create({
    data: {
      fullName: `Quote Customer ${suffix}`,
      email: `quote-customer-${suffix}@test.local`,
      phone: "9000000999",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      dealerId: dealer.id,
      configurationId: configuration.id,
    },
  });

  return { dealer, configuration, lead };
}

test.describe("Quote workflow", () => {
  test.describe.configure({ timeout: 90_000 });

  test("dealer can create, send, and convert a quote", async ({ page, seeded }) => {
    const { lead } = await seedQuoteLead(seeded);

    await loginAsDealer(page, seeded.testDealerProfile.email, seeded.testDealerProfile.password);

    const createResponse = await page.request.post("/api/quotes", {
      data: {
        leadId: lead.id,
        notes: "Enterprise quote test",
        discount: 125,
        tax: 18,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    expect(createResponse.status()).toBe(201);

    const createBody = await createResponse.json();
    expect(createBody.success).toBe(true);

    const sendResponse = await page.request.post(`/api/quotes/${createBody.quote.id}/send`, {
      data: {
        baseUrl: "http://localhost:3001",
      },
    });

    expect(sendResponse.status()).toBe(200);

    const sendBody = await sendResponse.json();
    expect(sendBody.success).toBe(true);

    await page.goto(`/quotes/${createBody.quote.id}?token=${createBody.accessToken}`);
    await expect(page.getByRole("heading", { name: new RegExp(createBody.quote.quoteNumber, "i") })).toBeVisible();

    const pdfResponse = await page.request.get(`/api/quotes/${createBody.quote.id}/pdf?token=${createBody.accessToken}`);
    expect(pdfResponse.status()).toBe(200);
    expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");

    const acceptResponse = await page.request.post(`/api/quotes/${createBody.quote.id}/accept`, {
      data: {
        token: createBody.accessToken,
        comment: "Looks good",
      },
    });

    expect(acceptResponse.status()).toBe(200);

    await expect.poll(async () => {
      const quote = await prisma.quote.findUnique({ where: { id: createBody.quote.id } });
      return quote?.status;
    }).toBe("CONVERTED");

    await expect.poll(async () => {
      const refreshedLead = await prisma.lead.findUnique({ where: { id: lead.id } });
      return refreshedLead?.status;
    }).toBe("CONVERTED");
  });

  test("rejected quotes stay rejected and invalid tokens are blocked", async ({ page, seeded }) => {
    const { lead } = await seedQuoteLead(seeded);

    await loginAsDealer(page, seeded.testDealerProfile.email, seeded.testDealerProfile.password);

    const createResponse = await page.request.post("/api/quotes", {
      data: {
        leadId: lead.id,
        notes: "Reject flow test",
        discount: 0,
        tax: 0,
      },
    });

    const createBody = await createResponse.json();
    await page.request.post(`/api/quotes/${createBody.quote.id}/send`, {
      data: { baseUrl: "http://localhost:3001" },
    });

    const invalidResponse = await page.request.get(`/api/quotes/${createBody.quote.id}/pdf?token=invalid-token`);
    expect(invalidResponse.status()).toBe(404);

    await page.goto(`/quotes/${createBody.quote.id}?token=${createBody.accessToken}`);
    const rejectResponse = await page.request.post(`/api/quotes/${createBody.quote.id}/reject`, {
      data: {
        token: createBody.accessToken,
        comment: "Not right for now",
      },
    });

    expect(rejectResponse.status()).toBe(200);

    await expect.poll(async () => {
      const quote = await prisma.quote.findUnique({ where: { id: createBody.quote.id } });
      return quote?.status;
    }).toBe("REJECTED");

    await expect.poll(async () => {
      const refreshedLead = await prisma.lead.findUnique({ where: { id: lead.id } });
      return refreshedLead?.status;
    }).toBe("PENDING");
  });

  test("cron expiration blocks stale quotes", async ({ page, seeded }) => {
    const { lead } = await seedQuoteLead(seeded);

    await loginAsDealer(page, seeded.testDealerProfile.email, seeded.testDealerProfile.password);

    const createResponse = await page.request.post("/api/quotes", {
      data: {
        leadId: lead.id,
        notes: "Expiration test",
        discount: 0,
        tax: 0,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    const createBody = await createResponse.json();

    await page.request.post(`/api/quotes/${createBody.quote.id}/send`, {
      data: { baseUrl: "http://localhost:3001" },
    });

    const cronResponse = await page.request.get("/api/cron/quotes/expire");
    expect(cronResponse.status()).toBe(200);

    await expect.poll(async () => {
      const quote = await prisma.quote.findUnique({ where: { id: createBody.quote.id } });
      return quote?.status;
    }).toBe("EXPIRED");
  });
});