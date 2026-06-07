import { expect, test } from "./fixtures";

test.describe("Configurator page — basic interaction smoke", () => {
  test("stepper navigation, fullscreen toggle, and mobile CTA", async ({ page }) => {
    await page.goto("/configurator");

    /*
     * Wait for 3D model readiness
     */
    await expect(page.getByTestId("configurator-ready")).toBeVisible({ timeout: 15000 });

    /*
     * Basic page loaded
     */
    await expect(
      page.getByRole("heading", {
        level: 1,
      })
    ).toBeVisible();

    /*
     * Stepper visible
     */
    const stepper = page.getByRole("navigation", {
      name: "Configurator steps",
    });

    await expect(stepper).toBeVisible();

    /*
     * Navigate to Lens step
     */
    const lensButton = stepper.getByRole("button", {
      name: /lens/i,
    });

    await expect(lensButton).toBeVisible();
    await lensButton.click();

    /*
     * Verify user reached lens section
     */
    await expect(
      page.getByRole("heading", {
        name: /Fine-?tune the lens/i,
      })
    ).toBeVisible({ timeout: 5000 });

    /*
     * Fullscreen viewer
     */
    const fullscreenButton = page.getByRole("button", {
      name: /enter fullscreen|exit fullscreen/i,
    });

    await expect(fullscreenButton).toBeVisible();
    await fullscreenButton.click();

    const closeViewerButton = page.getByRole("button", {
      name: /close viewer/i,
    });

    await expect(closeViewerButton).toBeVisible({
      timeout: 5000,
    });

    /*
     * Exit fullscreen
     * Note: We use page.evaluate() here because the combination of animate-viewer-enter 
     * and backdrop-blur can cause Playwright native clicks to occasionally miss 
     * the target during the transition frames in slow environments.
     */
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        /close viewer/i.test(b.textContent || "")
      ) as HTMLButtonElement | undefined;
      btn?.click();
    });

    // Wait until browser fully exits fullscreen before resizing
    await page.waitForFunction(() => !document.fullscreenElement);
    await expect(page.getByTestId("configurator-ready")).toBeVisible();

    /*
     * Mobile viewport
     */
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const requestQuoteButton = page.getByRole("button", {
      name: /request quote/i,
    });

    await expect(requestQuoteButton).toBeVisible();

    /*
     * Mobile CTA scroll
     */
    await requestQuoteButton.click();

    await expect(
      page.getByRole("heading", {
        name: /request quote/i,
      })
    ).toBeVisible({
      timeout: 5000,
    });
  });
});
