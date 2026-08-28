import { expect, test } from "@playwright/test";

test.describe("humo: la home responde y muestra la marca", () => {
  test("GET / responde 200", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
  });

  test('la home muestra el wordmark "Srod Almenara"', async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Srod Almenara" }),
    ).toBeVisible();
  });

  test("el documento declara el idioma español", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });
});
