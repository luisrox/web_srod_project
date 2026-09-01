import { expect, test } from "@playwright/test";

import { CURRENT_SHOP_URL } from "../../src/lib/shop";

const CASE_SLUG = "lookbook-verano-casco";

test.describe("aceptación SPEC §11", () => {
  test("Home: se entiende el oficio por el titular", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Srod Almenara" }),
    ).toBeVisible();
    await expect(
      page.getByText("Un DP bien geek que hace videos en YouTube"),
    ).toBeVisible();
  });

  test("abre un case con video facade y stills", async ({ page }) => {
    await page.goto(`/trabajo/${CASE_SLUG}`);

    const layer = page.locator('[data-ui="case-client"]');
    await expect(
      page.getByRole("heading", { level: 1, name: "Lookbook verano en Casco" }),
    ).toBeVisible();
    await expect(layer.getByRole("button", { name: /Reproducir/ })).toBeVisible();
    await expect(page.locator('[data-ui="youtube-embed"] iframe')).toHaveCount(0);
    await expect(page.locator('[data-ui="case-stills"] img')).toHaveCount(2);
  });

  test("abre la ficha técnica por click", async ({ page }) => {
    await page.goto(`/trabajo/${CASE_SLUG}`);

    const ficha = page.getByRole("button", { name: "Ficha técnica" });
    await ficha.click();
    await expect(ficha).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('[data-ui="case-geek"]')).toBeVisible();
    await expect(page.getByText("Cámara", { exact: true })).toBeVisible();
  });

  test("/kit muestra piezas con el porqué", async ({ page }) => {
    await page.goto("/kit");

    const list = page.locator('[data-ui="kit-list"]');
    await expect(list.getByRole("heading", { name: "Sony FX3" })).toBeVisible();
    await expect(list.getByText(/Mi cámara principal/i)).toBeVisible();
  });

  test("YouTube, Instagram y TikTok son visibles en el header", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: /canal de youtube/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /perfil de instagram/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /tiktok/i })).toBeVisible();
  });

  test("/contacto envía el form con honeypot vacío (API mockeada)", async ({
    page,
  }) => {
    await page.route("**/api/contacto", async (route) => {
      const raw = route.request().postData() ?? "{}";
      const body = JSON.parse(raw) as { empresa_url?: string };
      expect(body.empresa_url ?? "").toBe("");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/contacto");
    await page.getByLabel("Nombre").fill("Ada");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Mensaje").fill("Hay un brief.");
    await page.getByRole("button", { name: "Enviar" }).click();

    await expect(page.getByRole("status")).toContainText(/Mensaje enviado/i);
  });

  test("footer Presets apunta a la tienda documentada", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator('[data-ui="site-footer"]').getByRole("link", { name: "Presets" }),
    ).toHaveAttribute("href", CURRENT_SHOP_URL);
  });

  test("/presets redirige a la tienda actual, no es checkout propio", async ({
    request,
  }) => {
    const response = await request.get("/presets", { maxRedirects: 0 });

    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    expect(response.headers().location).toBe(CURRENT_SHOP_URL);
  });

  test("no hay /blog, /eventos ni checkout", async ({ page }) => {
    for (const path of ["/blog", "/eventos", "/checkout", "/carrito"]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
    }
  });
});
