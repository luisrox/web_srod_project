# Laboratorio web — Srod Almenara

Sitio de marca personal de [Srod Almenara](https://www.srodalmenara.com/): laboratorio público de un director de fotografía (DP + creador geek). Producto en **español**.

## Stack

Next.js (App Router) + TypeScript, Tailwind, Motion, Sanity (Studio embebido), Vercel, Resend, RSS de YouTube, widget Instagram (Behold), Plausible, Cloudflare Turnstile.

## Documentos

- **[SPEC.md](./SPEC.md)** — producto, arquitectura de información, CMS, stack y criterios de aceptación. Leer antes de tocar código.
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** — los 20 pasos de implementación, uno por sesión, con pruebas primero.

## Requisitos

- Node.js **22 LTS o superior** (mínimo real del tooling; ver *Nota sobre Node* más abajo).
- npm 10+.

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run lint` | ESLint (config Next) |
| `npm run typecheck` | TypeScript sin emitir |
| `npm test` | Unit y componentes (Vitest + Testing Library) |
| `npm run test:watch` | Vitest en modo watch |
| `npm run test:e2e` | Playwright (levanta el dev server solo) |
| `npm run seed:sanity` | Upsert de fixtures al dataset Sanity (manual; token write) |

Copia `.env.example` a `.env.local`. Variables:

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical, OG y sitemap. Fallback: `VERCEL_URL` o `https://www.srodalmenara.com` |
| `RESEND_API_KEY` / `RESEND_FROM` | Correo del formulario |
| `FORM_CC_EMAIL` | CC si no está en CMS |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Anti-spam |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | CMS público + Studio |
| `SANITY_API_READ_TOKEN` / `SANITY_API_WRITE_TOKEN` | Lectura / seed |
| `SANITY_REVALIDATE_SECRET` | Webhook ISR |
| `ENABLE_FIXTURE_FALLBACK` | Fallback a fixtures si Sanity cae (prod: off) |
| `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID` | Widget InstaShow. Vacío = el de Srod; `off` lo apaga |
| `BEHOLD_FEED_URL` | JSON del grid Instagram (solo si Elfsight está `off`) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analítica sin cookies. Vacío = sin script |

## Formulario de contacto

`POST /api/contacto` (JSON). Defensa: honeypot `empresa_url`, Cloudflare Turnstile y rate limit **en memoria de 5 envíos por IP cada 10 minutos** (429 si se excede; no se comparte entre instancias ni sobrevive a un restart).

Copia `.env.example` a `.env.local` y rellena:

- `RESEND_API_KEY` / `RESEND_FROM` — envío a `contactEmail` (CC: `formCcEmail` del CMS o `FORM_CC_EMAIL`)
- `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — widget en el form

En desarrollo **sin esas claves** el API responde 503 y el formulario no envía. Los tests mockean Turnstile y Resend; no se manda correo real.

## Sanity Studio

El CMS vive embebido en `/studio` (no hay enlace en el header público). Con `NEXT_PUBLIC_SANITY_PROJECT_ID` las páginas públicas leen Sanity; **sin ese env, y siempre en `npm test`**, el adapter de fixtures.

1. Crea un proyecto en [sanity.io/manage](https://www.sanity.io/manage) (dataset `production` para el sitio en vivo).
2. Copia `.env.example` a `.env.local` y pega `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET`.
3. Crea un token **Viewer** y pégalo en `SANITY_API_READ_TOKEN`.
4. En el proyecto Sanity, añade CORS para `http://localhost:3000` (y el dominio de Vercel).
5. Arranca `npm run dev` y abre `/studio`. Inicia sesión con la cuenta de Sanity.
6. Crea un token **Editor** en `SANITY_API_WRITE_TOKEN` y corre **a mano** (nunca en CI ni en test):

```bash
npm run seed:sanity
```

Eso upserta los mismos placeholders que `src/content/fixtures.ts` (`siteSettings`, projects, kitItems).

**Preview vs producción:** el dataset `production` es el de publicación. Los deploys de preview de Vercel usan el mismo dataset salvo que definas otro (`staging`) en el entorno de Preview. El adapter lee `perspective: "published"` (borradores de Studio no salen al lab hasta publicar).

**ISR:** las páginas que fetchean content revalidan cada 60 s. Para invalidar al publicar, en Sanity → API → Webhooks:

- URL: `https://<dominio>/api/revalidate`
- Método: POST
- Header `x-revalidate-secret` (o query `?secret=`) = `SANITY_REVALIDATE_SECRET`
- Trigger: create / update / delete en `siteSettings`, `project`, `kitItem`

Sin secreto la route responde 401.

**Si Sanity no responde:** en desarrollo se usan fixtures. En producción, la página falla a propósito (no se sirven placeholders viejos) salvo `ENABLE_FIXTURE_FALLBACK=true`.

Sin `NEXT_PUBLIC_SANITY_PROJECT_ID` el Studio monta con un id placeholder: la ruta existe, pero no autentica contra un proyecto real.

## Feed de YouTube (Home)

El bloque `data-ui="youtube-teaser"` vive dentro de **Trabajo destacado**. Lee el **RSS público** del canal (`feeds/videos.xml?channel_id=`), cache 1 h. No usa la Data API ni un ID hardcodeado en el componente: el UC va en CMS (`youtubeChannelId`; el fixture es el canal @srodmode). `/c/` y `@handle` no resuelven el RSS.

El video más reciente va al hero; el resto, a **Trabajo destacado**. Los cases de cliente viven en `/trabajo`. Si el fetch falla, queda el CTA «Ver el canal». Las cards son thumb + enlace a YouTube (el embed sigue solo en hero y cases).

## Operaciones

### Instagram (Home)

El grid (`data-ui="instagram-teaser"`) no usa Graph API ni app review. Por defecto monta el widget **Elfsight InstaShow** que ya está en [srodalmenara.com](https://www.srodalmenara.com/) (`NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID`; vacío = el id público de Srod). `off` lo apaga.

Si Elfsight está `off`, puede leer el JSON de **Behold** con `BEHOLD_FEED_URL`. Si tampoco hay feed: embed oficial del perfil (`/embed/`) + «Ver el perfil». En `next dev` con Elfsight off y Behold vacío hay stills de preview del lab. Header, Home y Contacto siguen enlazando a `instagramUrl` del CMS.

**Renovación:** el feed lo mantiene Elfsight (o Behold). No hay token de Meta en este repo. Si el widget cae, el lab no se rompe: queda el enlace al perfil.

Cero secretos en git: el id del widget es público (va en el HTML). Overrides en `.env.local` / Vercel.

### Analítica

Plausible: script oficial solo si `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` está definido. No hay Google Analytics ni cookies de marketing.

### Cutover DNS

Cuando Srod decida publicar el lab: `srodalmenara.com` → Vercel. La tienda de presets **no se reescribe**. `/presets` en este sitio redirige (307, no permanente) a `CURRENT_SHOP_URL` en `src/lib/shop.ts` (hoy el Squarespace). El footer y Home leen `shopUrl` del CMS; el seed usa la misma constante. Cuando el dominio apunte aquí, actualiza esa URL (o un `shop.` que siga en Squarespace) para no romper compras.

### Checklist de aceptación manual (CMS, sin deploy)

Los e2e usan fixtures. Srod acepta la fase 1 cuando, **con Sanity conectado**, esto se ve en el lab sin un deploy nuevo:

1. Abre `/studio`, publica un cambio del **titular** (`siteSettings.heroTitle`).
2. Confirma que el webhook `POST /api/revalidate` está configurado (o espera ≤ 60 s de ISR).
3. Recarga `/` y comprueba el titular nuevo en el hero y en el `<title>`.
4. Edita un **proyecto** (título o still) y un **kitItem** (nota de uso). Publica.
5. Recarga `/trabajo/[slug]` y `/kit`: el copy/foto nuevos están. Home refleja destacados y teaser si tocaste esos campos.

Si el webhook no dispara, `POST /api/revalidate` con `x-revalidate-secret` invalida a mano.

Antes del primer `npm run test:e2e`, instalar el navegador:

```bash
npx playwright install chromium
```

## Estructura

```
src/
  app/         # rutas App Router
  components/  # UI integrada en páginas
  lib/         # utilidades, correo, Turnstile, rate limit
  content/     # ContentRepository + fixtures
  domain/      # Zod (sitio, contacto)
  sanity/      # schemas del Studio (paridad 1:1 con Zod)
  styles/      # globals + tokens
tests/
  e2e/         # Playwright
```

Alias `@/*` → `src/*`. Las carpetas `content/`, `domain/`, `sanity/` y `public/` se crean en los pasos que las estrenan: el repo no guarda directorios vacíos.

Las pruebas unitarias viven junto al código (`*.test.ts`, `*.test.tsx`); las de extremo a extremo, en `tests/e2e`.

## Nota sobre Node

El entorno actual de desarrollo corre **Node 20.11.1**, que ya no soporta parte del tooling moderno: Vitest 4 y jsdom 30 exigen Node ≥ 20.19 / 22. Por eso están fijados Vitest 3.2, Vite 6 y jsdom 26. Al actualizar a Node 22 o 24 se pueden subir esas tres dependencias a su última versión.

## Fuera de esta fase

No hay e-commerce nuevo, blog, eventos, i18n ni sección de música. La tienda de presets permanece en el sitio actual, enlazada.
