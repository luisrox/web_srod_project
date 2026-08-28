# Laboratorio web — Srod Almenara

Sitio de marca personal de [Srod Almenara](https://www.srodalmenara.com/): laboratorio público de un director de fotografía (DP + creador geek). Producto en **español**.

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

Antes del primer `npm run test:e2e`, instalar el navegador:

```bash
npx playwright install chromium
```

## Estructura

```
src/
  app/        # rutas App Router
  lib/        # utilidades y constantes de marca
  styles/     # globals + tokens
tests/
  e2e/        # Playwright
```

Alias `@/*` → `src/*`. Las carpetas `components/`, `content/`, `domain/` y `sanity/` se crean en los pasos que las estrenan: el repo no guarda directorios vacíos.

Las pruebas unitarias viven junto al código (`*.test.ts`, `*.test.tsx`); las de extremo a extremo, en `tests/e2e`.

## Nota sobre Node

El entorno actual de desarrollo corre **Node 20.11.1**, que ya no soporta parte del tooling moderno: Vitest 4 y jsdom 30 exigen Node ≥ 20.19 / 22. Por eso están fijados Vitest 3.2, Vite 6 y jsdom 26. Al actualizar a Node 22 o 24 se pueden subir esas tres dependencias a su última versión.

## Fuera de esta fase

No hay e-commerce nuevo, blog, eventos, i18n ni sección de música. La tienda de presets permanece en el sitio actual, enlazada.
