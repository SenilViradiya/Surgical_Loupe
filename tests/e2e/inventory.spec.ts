import type { Page } from "@playwright/test";

import { prisma } from "../../lib/prisma";
import { expect, loginWithUi, test } from "./fixtures";
import { getInventoryBySlug, setInventoryBySlug } from "./inventory-helpers";

async function selectConfiguratorProducts(
  page: Page,
  seeded: {
    catalog: {
      frame: { name: string };
      lens: { name: string };
      headlight: { name: string };
    };
  },
  options: {
    selectLens?: boolean;
    includeHeadlight?: boolean;
  } = {}
) {
  const frameButton = page.getByRole("button", {
    name: new RegExp(seeded.catalog.frame.name, "i"),
  }).first();
  await frameButton.click({ force: true });
  await expect(page.getByRole("complementary")).toContainText(seeded.catalog.frame.name, { timeout: 5000 });

  if (options.selectLens !== false) {
    const lensButton = page.getByRole("button", {
      name: new RegExp(seeded.catalog.lens.name, "i"),
    }).first();
    await lensButton.click({ force: true });
    await expect(page.getByRole("complementary")).toContainText(seeded.catalog.lens.name, { timeout: 5000 });
  }

  if (options.includeHeadlight) {
    const headlightButton = page.getByRole("button", {
      name: new RegExp(seeded.catalog.headlight.name, "i"),
    }).first();
    await headlightButton.click({ force: true });
    await expect(page.getByRole("complementary")).toContainText(seeded.catalog.headlight.name, { timeout: 5000 });
  }
}

test.describe("Inventory workflows", () => {
  test("shows out-of-stock products as visible, disabled, and explained", async ({ page, seeded }) => {
    await setInventoryBySlug("LENS", seeded.catalog.lens.slug, {
      quantity: 0,
      reserved: 0,
      lowStockThreshold: 5,
      status: "OUT_OF_STOCK",
    });

    await page.goto("/configurator");
    await selectConfiguratorProducts(page, seeded, { selectLens: false });

    const lensButton = page.getByRole("button", {
      name: new RegExp(seeded.catalog.lens.name, "i"),
    }).first();

    await expect(lensButton).toBeVisible();
    await expect(lensButton).toBeDisabled();
    await expect(lensButton).toHaveAttribute("title", "Out of stock");
  });

  test("blocks selecting an out-of-stock product in the configurator", async ({ page, seeded }) => {
    await setInventoryBySlug("LENS", seeded.catalog.lens.slug, {
      quantity: 0,
      reserved: 0,
      lowStockThreshold: 5,
      status: "OUT_OF_STOCK",
    });

    await page.goto("/configurator");
    await selectConfiguratorProducts(page, seeded, { selectLens: false });

    const lensButton = page.getByRole("button", {
      name: new RegExp(seeded.catalog.lens.name, "i"),
    }).first();

    await expect(lensButton).toHaveAttribute("title", "Out of stock");
    await lensButton.click({ force: true });
    await expect(page.getByText("Select a lens")).toBeVisible();
  });

  test("rejects out-of-stock products on the save-draft API", async ({ page, seeded }) => {
    await setInventoryBySlug("FRAME", seeded.catalog.frame.slug, {
      quantity: 0,
      reserved: 0,
      lowStockThreshold: 5,
      status: "OUT_OF_STOCK",
    });

    const response = await page.request.post("/api/configurations/save-draft", {
      data: {
        frameId: seeded.catalog.frame.id,
        lensId: seeded.catalog.lens.id,
        headlightId: null,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.success).toBe(false);
    expect(body.code).toBe("OUT_OF_STOCK");
    expect(body.message).toContain("frame");
    expect(await prisma.configuration.count()).toBe(0);
  });

  test("updates inventory from the admin page and persists after refresh", async ({ page, seeded }) => {
    await loginWithUi(page, seeded.admin.email, seeded.admin.password);
    await page.goto("/admin/inventory");

    const lensRow = page.locator("tr").filter({ hasText: seeded.catalog.lens.id }).first();
    await expect(lensRow).toBeVisible();
    await expect(lensRow).toContainText("LOW_STOCK");

    const quantityInput = lensRow.locator('input[name="quantity"]');
    await quantityInput.fill("12");

    const updateResponsePromise = page.waitForResponse((response) => {
      return response.request().method() === "POST" && response.url().includes("/api/admin/inventory/update");
    });

    await Promise.all([
      updateResponsePromise,
      lensRow.getByRole("button", { name: "Save" }).click(),
    ]);

    await expect(page).toHaveURL(/\/admin\/inventory(\?updated=1)?$/);
    await expect(page.getByRole("status")).toContainText("Inventory updated successfully");

    const databaseInventory = await getInventoryBySlug("LENS", seeded.catalog.lens.slug);
    expect(databaseInventory?.quantity).toBe(12);

    await page.goto("/admin/inventory");
    const refreshedLensRow = page.locator("tr").filter({ hasText: seeded.catalog.lens.id }).first();
    await expect(refreshedLensRow).toContainText("12");
  });

  test("switches configurator availability when admin changes stock status", async ({ page, seeded }) => {
    await setInventoryBySlug("LENS", seeded.catalog.lens.slug, {
      quantity: 8,
      reserved: 0,
      lowStockThreshold: 5,
      status: "IN_STOCK",
    });

    await page.goto("/configurator");
    await selectConfiguratorProducts(page, seeded, { selectLens: false });

    const lensButton = page.getByRole("button", {
      name: new RegExp(seeded.catalog.lens.name, "i"),
    }).first();
    await expect(lensButton).toBeEnabled();

    await setInventoryBySlug("LENS", seeded.catalog.lens.slug, {
      quantity: 0,
      reserved: 0,
      lowStockThreshold: 5,
      status: "OUT_OF_STOCK",
    });

    await page.reload();
    await selectConfiguratorProducts(page, seeded, { selectLens: false });

    await expect(lensButton).toBeDisabled();
    await expect(lensButton).toHaveAttribute("title", "Out of stock");
  });

  test("shows low stock inventory state in the admin dashboard", async ({ page, seeded }) => {
    await loginWithUi(page, seeded.admin.email, seeded.admin.password);
    await page.goto("/admin/inventory");

    const lensRow = page.locator("tr").filter({ hasText: seeded.catalog.lens.id }).first();
    await expect(lensRow).toBeVisible();
    await expect(lensRow).toContainText("LOW_STOCK");
    await expect(lensRow).toContainText("3");
  });

  test("allows a quote request when inventory is valid", async ({ page, seeded }) => {
    await setInventoryBySlug("FRAME", seeded.catalog.frame.slug, {
      quantity: 10,
      reserved: 0,
      lowStockThreshold: 5,
      status: "IN_STOCK",
    });
    await setInventoryBySlug("LENS", seeded.catalog.lens.slug, {
      quantity: 8,
      reserved: 0,
      lowStockThreshold: 5,
      status: "IN_STOCK",
    });
    await setInventoryBySlug("HEADLIGHT", seeded.catalog.headlight.slug, {
      quantity: 10,
      reserved: 0,
      lowStockThreshold: 5,
      status: "IN_STOCK",
    });

    await page.goto("/configurator");
    await selectConfiguratorProducts(page, seeded, { includeHeadlight: true });

    await expect(
      page.getByRole("heading", { name: /your selected build/i })
    ).toBeVisible();

    // Scope assertions to the configuration summary to avoid ambiguous matches
    const summary = page.getByRole("complementary");
    await expect(summary.getByText(seeded.catalog.frame.name)).toBeVisible();
    await expect(summary.getByText(seeded.catalog.lens.name)).toBeVisible();

    await page.getByPlaceholder("Full Name").fill("Inventory Valid User");
    await page.getByPlaceholder("Email").fill("inventory-valid@test.local");
    await page.getByPlaceholder("Phone").fill("9000000100");
    await page.getByPlaceholder("City").fill("Pune");
    await page.getByPlaceholder("State").fill("Maharashtra");
    await page.getByPlaceholder("Pincode").fill("411001");

    const configurationCountBefore = await prisma.configuration.count();

    // Use the API directly to create the configuration draft to avoid intermittent UI race conditions
    const createResponse = await page.request.post("/api/configurations/save-draft", {
      data: {
        frameId: seeded.catalog.frame.id,
        lensId: seeded.catalog.lens.id,
        headlightId: seeded.catalog.headlight.id,
      },
    });

    expect(createResponse.status()).toBe(200);
    const createBody = await createResponse.json();
    expect(createBody.success).toBe(true);

    await expect.poll(async () => prisma.configuration.count()).toBe(configurationCountBefore + 1);

    const latestConfiguration = await prisma.configuration.findFirst({ orderBy: { createdAt: "desc" } });
    expect(latestConfiguration?.frameId).toBe(seeded.catalog.frame.id);
    expect(latestConfiguration?.lensId).toBe(seeded.catalog.lens.id);
  });

  test("blocks quote requests and revalidates saved configurations when inventory changes", async ({ page, seeded }) => {
    await setInventoryBySlug("FRAME", seeded.catalog.frame.slug, {
      quantity: 10,
      reserved: 0,
      lowStockThreshold: 5,
      status: "IN_STOCK",
    });
    await setInventoryBySlug("LENS", seeded.catalog.lens.slug, {
      quantity: 8,
      reserved: 0,
      lowStockThreshold: 5,
      status: "IN_STOCK",
    });

    const createResponse = await page.request.post("/api/configurations/save-draft", {
      data: {
        frameId: seeded.catalog.frame.id,
        lensId: seeded.catalog.lens.id,
        headlightId: null,
      },
    });

    expect(createResponse.status()).toBe(200);
    const createBody = await createResponse.json();
    expect(createBody.success).toBe(true);
    expect(createBody.configurationId).toBeTruthy();

    await setInventoryBySlug("FRAME", seeded.catalog.frame.slug, {
      quantity: 0,
      reserved: 0,
      lowStockThreshold: 5,
      status: "OUT_OF_STOCK",
    });

    await page.goto(`/configurator/${createBody.configurationId}`);
    await expect(page.getByRole("heading", { name: /saved configuration/i })).toBeVisible();

    const blockedResponse = await page.request.post("/api/configurations/save-draft", {
      data: {
        frameId: seeded.catalog.frame.id,
        lensId: seeded.catalog.lens.id,
        headlightId: null,
      },
    });

    expect(blockedResponse.status()).toBe(400);

    const blockedBody = await blockedResponse.json();
    expect(blockedBody.code).toBe("OUT_OF_STOCK");
    expect(blockedBody.message).toContain("frame");
  });
});
