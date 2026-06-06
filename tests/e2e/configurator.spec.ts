import { expect, test } from "./fixtures";

test.describe(
  "Configurator page — basic interaction smoke",
  () => {
    test(
      "stepper navigation, fullscreen toggle, and mobile CTA",
      async ({ page }) => {
        await page.goto("/configurator");

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

        const stepper =
          page.getByRole(
            "navigation",
            {
              name:
                "Configurator steps",
            }
          );

        await expect(
          stepper
        ).toBeVisible();

        /*
         * Navigate to Lens step
         */

        const lensButton =
          stepper.getByRole(
            "button",
            {
              name: /lens/i,
            }
          );

        await expect(
          lensButton
        ).toBeVisible();

        await lensButton.click();

        /*
         * Verify user reached lens section
         * (more reliable than only checking aria state)
         */

        await expect(
          page.getByRole(
            "heading",
            {
              name: /Fine-?tune the lens/i,
            }
          )
        ).toBeVisible({ timeout: 5000 });

        /*
         * Fullscreen viewer
         */

        const fullscreenButton =
          page.getByRole(
            "button",
            {
              name:
                /enter fullscreen|exit fullscreen/i,
            }
          );

        await expect(
          fullscreenButton
        ).toBeVisible();

        await fullscreenButton.click();

        const closeViewerButton =
          page.getByRole(
            "button",
            {
              name:
                /close viewer/i,
            }
          );

        await expect(
          closeViewerButton
        ).toBeVisible({
          timeout: 5000,
        });

        /*
         * Exit fullscreen
         */

        await closeViewerButton.click({ force: true });

        // Ensure the document fullscreen is exited before resizing the window
        await page.evaluate(async () => {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
          }
        });
        await page.waitForTimeout(300);
        /*
         * Mobile viewport
         */

        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        const requestQuoteButton =
          page.getByRole(
            "button",
            {
              name:
                /request quote/i,
            }
          );

        await expect(
          requestQuoteButton
        ).toBeVisible();

        /*
         * Mobile CTA scroll
         */

        await requestQuoteButton.click();

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                /request quote/i,
            }
          )
        ).toBeVisible({
          timeout: 5000,
        });
      }
    );
  }
);