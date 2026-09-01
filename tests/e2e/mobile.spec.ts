import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 360, height: 740 } });

const overflowTolerancePx = 8;

async function horizontalOverflow(page: {
  evaluate: (fn: () => number) => Promise<number>;
}) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}

test.describe("móvil 360px", () => {
  test("Home no desborda el viewport de forma grosera", async ({ page }) => {
    await page.goto("/");
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(
      overflowTolerancePx,
    );
  });

  test("un case no desborda el viewport de forma grosera", async ({ page }) => {
    await page.goto("/trabajo/lookbook-verano-casco");
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(
      overflowTolerancePx,
    );
  });
});
