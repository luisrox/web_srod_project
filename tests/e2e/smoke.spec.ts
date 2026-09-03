import { expect, test } from "@playwright/test";

const CASE_SLUG = "lookbook-verano-casco";

const routes: Array<{ path: string; heading: string }> = [
  { path: "/", heading: "Srod Almenara" },
  { path: "/recomendados", heading: "Recomendados" },
  { path: "/trabajo", heading: "Trabajo" },
  { path: `/trabajo/${CASE_SLUG}`, heading: "Lookbook verano en Casco" },
  { path: "/kit", heading: "Kit" },
  { path: "/sobre", heading: "Sobre Srod" },
  { path: "/contacto", heading: "Contacto" },
  { path: "/privacidad", heading: "Privacidad" },
];

test.describe("humo: mapa de rutas de fase 1", () => {
  for (const { path, heading } of routes) {
    test(`${path} responde 200 y muestra un h1 distintivo`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
    });
  }

  test("el documento declara el idioma español", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("/trabajo/este-slug-no-existe es 404 propio, no el de Next", async ({
    page,
  }) => {
    const response = await page.goto("/trabajo/este-slug-no-existe");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "Página no encontrada" }),
    ).toBeVisible();
    await expect(
      page.locator("#contenido").getByRole("link", { name: "Inicio" }),
    ).toBeVisible();
    await expect(
      page.locator("#contenido").getByRole("link", { name: "Trabajo" }),
    ).toBeVisible();
    await expect(
      page.getByText("This page could not be found"),
    ).toHaveCount(0);
  });

  test("desde el inicio el enlace Recomendados del header aterriza en /recomendados", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("link", { name: "Recomendados" })
      .click();

    await expect(page).toHaveURL(/\/recomendados\/?$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Recomendados" }),
    ).toBeVisible();
  });

  test("el header Contacto abre el modal en la misma página", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("button", { name: "Contacto" })
      .click();

    const dialog = page.getByRole("dialog", { name: "Contacto" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Nombre")).toBeVisible();
    await expect(page).toHaveURL(/\/?$/);

    await dialog.getByRole("button", { name: "Cerrar" }).click();
    await expect(dialog).toHaveCount(0);
  });

  test("el CTA de Home abre el modal de contacto", async ({ page }) => {
    await page.goto("/");

    await page
      .locator('[data-ui="contact-cta"]')
      .getByRole("button", { name: "Contacto" })
      .click();

    const dialog = page.getByRole("dialog", { name: "Contacto" });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/?$/);
  });

  test("Home Instagram es plan B o grid y el header sigue al perfil", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator('[data-ui="instagram-teaser"]')).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Ver el perfil/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /perfil de instagram/i }),
    ).toBeVisible();
  });

  test("el hero muestra el titular del fixture y un botón de reproducir", async ({
    page,
  }) => {
    await page.goto("/");

    const hero = page.locator('[data-ui="hero"]');
    await expect(
      hero.getByText("Un DP bien geek que hace videos en YouTube"),
    ).toBeVisible();
    await expect(
      hero.getByRole("button", { name: /Reproducir/ }),
    ).toBeVisible();
  });

  test("/trabajo muestra los cinco cases y abre uno al hacer click", async ({
    page,
  }) => {
    await page.goto("/trabajo");

    const index = page.locator('[data-ui="work-index"]');
    const titles = [
      "Lookbook verano en Casco",
      "Comercial café de altura",
      "Spot reloj nocturno",
      "Campaña marca ciudad",
      "Retratos Estudio Blanco",
    ];

    for (const title of titles) {
      await expect(index.getByRole("link", { name: title })).toBeVisible();
    }

    await index.getByRole("link", { name: "Retratos Estudio Blanco" }).click();

    await expect(page).toHaveURL(/\/trabajo\/retrato-estudio-blanco\/?$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Retratos Estudio Blanco" }),
    ).toBeVisible();
  });

  test("el case muestra la capa cliente sin ficha geek", async ({ page }) => {
    await page.goto("/trabajo/lookbook-verano-casco");

    const layer = page.locator('[data-ui="case-client"]');
    await expect(layer).toBeVisible();
    await expect(layer.getByText("Casa Textil")).toBeVisible();
    await expect(layer.getByRole("button", { name: /Reproducir/ })).toBeVisible();
    await expect(page.locator('[data-ui="case-stills"] img')).toHaveCount(2);
    await expect(page.locator('[data-ui="case-geek"]')).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Ficha técnica" }),
    ).toHaveAttribute("aria-expanded", "false");
    await expect(
      layer.getByRole("link", { name: "escríbeme" }),
    ).toHaveAttribute("href", "/contacto");
  });

  test("en un case con ficha, Tab llega al botón y Enter muestra Cámara", async ({
    page,
  }) => {
    await page.goto("/trabajo/lookbook-verano-casco");

    const ficha = page.getByRole("button", { name: "Ficha técnica" });
    await expect(ficha).toBeVisible();

    let reached = false;
    for (let i = 0; i < 30; i += 1) {
      await page.keyboard.press("Tab");
      if (await ficha.evaluate((el) => el === document.activeElement)) {
        reached = true;
        break;
      }
    }

    expect(reached).toBe(true);
    await expect(ficha).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(ficha).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('[data-ui="case-geek"]')).toBeVisible();
    await expect(page.getByText("Cámara", { exact: true })).toBeVisible();
  });

  test("/recomendados muestra los cuatro enlaces de afiliado", async ({
    page,
  }) => {
    await page.goto("/recomendados");

    const list = page.locator('[data-ui="pick-list"]');
    await expect(
      list.getByRole("heading", { name: "Brandon Li x Freewell VND/CPL" }),
    ).toBeVisible();
    await expect(
      list.getByRole("heading", { name: "Money Shot Club" }),
    ).toBeVisible();
    await expect(list.getByRole("heading", { name: "Arc Pulse" })).toBeVisible();
    await expect(list.getByRole("heading", { name: "Artlist" })).toBeVisible();
    await expect(
      list.getByRole("link", { name: /Brandon Li x Freewell VND\/CPL/ }),
    ).toHaveAttribute("href", /freewellgear\.com/);
    await expect(
      list.getByRole("link", { name: /Money Shot Club/ }),
    ).toHaveAttribute("href", /skool\.com\/moneyshotclub/);
    await expect(
      list.getByRole("link", { name: /Arc Pulse/ }),
    ).toHaveAttribute("href", /arc\.cc/);
    await expect(
      list.getByRole("link", { name: /Artlist/ }),
    ).toHaveAttribute("href", /bit\.ly\/ArtlistSrodMode/);
  });

  test("/kit muestra al menos tres piezas conocidas del fixture", async ({
    page,
  }) => {
    await page.goto("/kit");

    const list = page.locator('[data-ui="kit-list"]');
    await expect(list.getByRole("heading", { name: "Sony FX3" })).toBeVisible();
    await expect(
      list.getByRole("heading", { name: "Sony FE 50mm F1.2 GM" }),
    ).toBeVisible();
    await expect(list.getByRole("heading", { name: "Zoom F6" })).toBeVisible();
    await expect(list.getByText(/Comprar en Amazon/)).toHaveCount(0);
    await expect(
      list.getByRole("link", { name: /Sony FX3/ }),
    ).toHaveAttribute("href", /amzn\.to/);
  });

  test("/sobre carga el retrato y un enlace a contacto", async ({ page }) => {
    await page.goto("/sobre");

    const main = page.locator("#contenido");
    await expect(
      main.getByRole("img", { name: /Retrato de Srod Almenara/i }),
    ).toBeVisible();
    await expect(main.getByRole("link", { name: "escríbeme" })).toHaveAttribute(
      "href",
      "/contacto",
    );
  });

  test("/contacto muestra el email de respaldo, el formulario y la ubicación", async ({
    page,
  }) => {
    await page.goto("/contacto");

    const main = page.locator("#contenido");
    await expect(main.getByText("srod@srodalmenara.com")).toBeVisible();
    await expect(
      main.getByRole("form", { name: "Formulario de contacto" }),
    ).toBeVisible();
    await expect(main.getByLabel("Nombre")).toBeVisible();
    await expect(main.getByRole("button", { name: "Enviar" })).toBeVisible();
    await expect(main.getByText(/Panamá/)).toBeVisible();
    await expect(main.getByText(/remot/i)).toBeVisible();
  });
});
