# Plan e instrucciones de implementación — laboratorio Srod Almenara

Documento de trabajo para implementar [SPEC.md](./SPEC.md) con un LLM de generación de código, **un paso a la vez**, con pruebas primero. Idioma del producto: **español**.

---

## Cómo usar este documento

1. Lee **SPEC.md** completo antes del primer prompt.
2. Ejecuta **un solo prompt por conversación o turno de implementación**.
3. Cada bloque `text` es el mensaje que pegas al modelo. No combines dos pasos.
4. Tras cada paso: las pruebas nuevas deben pasar, las anteriores no deben romperse, y el código nuevo debe estar **conectado** a rutas, layout o capa de datos ya existentes.
5. Si un paso falla, corrígelo antes de avanzar. No “dejes deuda” para el siguiente prompt.
6. No implementes e-commerce, blog, eventos, i18n, dark mode, login ni sección de música.

---

## Estado de avance

| Paso | Estado | Verificado |
|---|---|---|
| 01 — Scaffold y arnés de pruebas | Hecho | `npm test` (16 pruebas), `lint`, `typecheck`, `build` en verde; `/` responde 200 con `<html lang="es">` y `h1` = "Srod Almenara" |
| 02 — Tokens y superficie de galería clara | Hecho | `tokens.ts` ↔ `tokens.css` con paridad probada, `GalleryBox` integrado en la Home, `:focus-visible` global, fuentes `next/font` en el layout |
| 03–20 | Pendientes | — |

Deuda conocida al cerrar el paso 02 (se resuelve en los pasos indicados, no es un paso extra):

- La Home tiene un párrafo de relleno hardcodeado que menciona Panamá. Sale en el paso 03 (titular desde el repositorio) y el paso 07 lo prohíbe en el hero por prueba.
- `public/` todavía no existe. La estrena el paso 03 con `/public/placeholders/`; el favicon llega en el paso 20.
- El e2e de humo requiere `npx playwright install chromium` en la máquina; sin el binario los 3 specs fallan por entorno, no por código.

---

## Principios que gobiernan todos los pasos

- **TDD:** prueba que falla → implementación mínima → refactor. Nada de código de producto sin una prueba que lo justifique (unitaria, de componente o e2e, según el paso).
- **Incremental:** cada paso añade una capacidad observable (ruta, contrato, integración). Prohibido un salto de “scaffold → sitio completo”.
- **Sin huérfanos:** todo módulo se importa desde una ruta, layout, repositorio o prueba. Si un archivo no se usa al cerrar el paso, no se crea.
- **Placeholders de calidad:** copy, stills y videos dummy coherentes con un DP geek (cámaras, color, proceso). Cero lorem rosa.
- **Accesibilidad y móvil desde el primer UI:** foco visible, labels, `prefers-reduced-motion` cuando haya motion, layouts desde 360px.
- **Contrato de contenido primero:** Zod en la app es la fuente de forma; Sanity se alinea después, no al revés.

---

## Decisiones de arquitectura (bloqueadas)

Estas decisiones evitan que cada prompt reinvente el stack.

| Pieza | Decisión | Motivo |
|---|---|---|
| App | Next.js App Router + TypeScript `strict` | Spec §8; metadata, ISR, rutas |
| Estilos | Tailwind CSS + tokens CSS en un único archivo | Galería clara, sistema de tipo/espacio |
| Validación de dominio | Zod (`src/domain`) | Mismos shapes en fixtures, CMS y UI |
| Datos | Puerto `ContentRepository` | Fixtures ahora; Sanity después; tests no dependen de red |
| CMS | Sanity + Studio embebido en `/studio` | Spec; Srod edita sin deploy |
| Motion | Motion (ex Framer Motion), sin WebGL | Cortes/fade; se añade tarde |
| Correo | Resend | Formulario |
| Anti-spam | Honeypot + Cloudflare Turnstile | Spec §5 |
| YouTube feed | RSS del canal (plan A); Data API solo si RSS no basta | Menos secretos; degradación clara |
| Instagram | Componente grid + proveedor inyectable (widget tipo Behold) | API Meta no es el camino de fase 1 |
| Analítica | Plausible (script oficial, sin cookies de marketing) | Spec §7 |
| Tests | Vitest + Testing Library + Playwright | Unit/componentes + viaje de aceptación |
| Hosting | Vercel (ISR en cases) | Spec §8 |

### Restricciones de la versión instalada (Next.js 16)

El repo corre **Next.js 16 con React 19**. No es el Next.js de la memoria de un LLM: varias APIs que aparecen en tutoriales de la 13/14 ya no existen. Reglas duras para todos los pasos:

- **APIs de request asíncronas.** `params` y `searchParams` en `page`, `layout`, `route`, `generateMetadata`, `icon` y `opengraph-image`, más `cookies()`, `headers()` y `draftMode()`, son *promesas*. Hay que `await`. El shim síncrono de la 15 se eliminó: acceder a `params.slug` directo revienta en runtime. Afecta a los pasos 04, 10, 11, 16 y 20. `npx next typegen` genera los helpers `PageProps` / `LayoutProps` / `RouteContext`.
- **Turbopack es el bundler por defecto** en `dev` y `build`. No añadas configuración de webpack.
- **`next lint` no existe.** El script `lint` invoca el CLI de ESLint (ya está así en `package.json`).
- **Sin `middleware.ts`.** La convención se renombró a `proxy.ts` (solo runtime Node). Ningún paso de este plan necesita interceptar peticiones: el redirect de `/presets` va en `redirects()` de `next.config.ts`, no en proxy.
- **Caché.** Usa `fetch(url, { next: { revalidate } })` y `export const revalidate` por segmento. No uses `unstable_cache`. Si necesitas `revalidateTag`, la firma es `revalidateTag(tag, profile)`: con un solo argumento lanza error.
- **Node ≥ 20.9** (ver la nota de Node del README antes de subir dependencias de test).
- Cada paso corre además `npm run typecheck`: TypeScript `strict` con `noUnusedLocals` no perdona archivos huérfanos a medio conectar.

### Árbol de carpetas (no desviarse)

```
src/
  app/                 # rutas App Router
  components/          # UI integrada en páginas
  content/             # ContentRepository + adapters (fixtures, sanity)
  domain/              # Zod + tipos inferidos
  lib/                 # youtube, seo, mail, turnstile, analytics
  styles/              # tokens + globals
  sanity/              # schemas, client, groq (a partir del paso CMS)
tests/
  e2e/                 # Playwright
public/                # placeholders/ (stills, posters) desde el paso 03; favicon en el paso 20
```

Las carpetas se crean en el paso que las estrena: el repo no versiona directorios vacíos. Dentro de `components/` los subgrupos por superficie (`home/`, `work/`, `kit/`, `contact/`) los abre el paso que los usa.

Alias `@/*` → `src/*`.

### Puerto de contenido (se crea en el paso 3 y no se rompe)

```ts
getSiteSettings(): Promise<SiteSettings>
getProjects(): Promise<Project[]>
getProjectBySlug(slug: string): Promise<Project | null>
getFeaturedProjects(): Promise<Project[]>
getKitItems(): Promise<KitItem[]>
getKitTeaser(): Promise<KitItem[]>
```

Hasta Sanity, el adapter es `fixtures`. Después, `sanity` implementa el mismo puerto. Las páginas **solo** hablan con el puerto.

---

## Refinado del desglose (cómo se llegó al tamaño de los pasos)

### Pase 1 — épicas (demasiado gruesas)

1. Cimientos  
2. Modelo de contenido  
3. Chrome del sitio  
4. Home  
5. Trabajo + cases  
6. Kit + Sobre  
7. Contacto  
8. CMS  
9. Feeds sociales  
10. SEO, motion, analítica, aceptación  

Un LLM que reciba “haz la Home” mezcla hero, IG, YouTube, kit y CTA sin pruebas útiles. Descartado como unidad de implementación.

### Pase 2 — features (demasiado finas)

~35 ítems (tokens solos, privacidad sola, seed Sanity solo, `robots.txt` solo). Muchos no avanzan el producto de forma observable y generan PRs de un archivo. Descartado.

### Pase 3 — tamaño objetivo (este documento)

Veinte pasos. Cada uno:

- cabe en **una sesión de implementación** con pruebas;
- deja el sitio **más completo y navegable** que antes;
- no introduce más de **un** sistema externo nuevo (CMS, Resend, Turnstile, RSS, widget IG, Plausible);
- termina con integración (ruta, layout o adapter), nunca con un util suelto.

### Pase 4 — control de picos de complejidad

- Motion **después** de que todas las páginas existan (el look cinemático no bloquea contenido).
- Sanity **después** de que la UI ya renderice fixtures (el Studio no se convierte en prerrequisito de cada página).
- Formulario: UI y validación **antes** de correo y Turnstile.
- Feeds YT/IG **después** de Home con huecos explícitos (placeholders que ya enlazan al canal/perfil).
- E2E de aceptación al final, con humo de rutas desde el paso 4.

---

## Mapa de dependencias

```
01 scaffold
 └─ 02 tokens
     └─ 03 dominio + repositorio + fixtures
         ├─ 04 rutas stub + metadata
         │   └─ 05 header/footer
         │       └─ 06 primitivas + YouTubeEmbed
         │           ├─ 07 home hero
         │           │   └─ 08 home bloques editoriales
         │           ├─ 09 /trabajo
         │           │   ├─ 10 case cliente
         │           │   └─ 11 ficha técnica
         │           ├─ 12 /kit
         │           ├─ 13 /sobre
         │           └─ 14 /contacto UI + /privacidad
         │               └─ 15 API form + Turnstile + Resend
         ├─ 16 Sanity schemas + Studio
         │   └─ 17 adapter Sanity (mismo puerto)
         ├─ 18 feed YouTube (sustituye hueco de 08)
         └─ 19 grid Instagram (sustituye hueco de 08)
             └─ 20 SEO + motion + analítica + e2e + docs
```

Los pasos 09–15 son paralelizables **en teoría** tras el 06, pero deben ejecutarse **en orden** para que cada prompt asuma un árbol estable.

---

## Paso 01 — Scaffold y arnés de pruebas

Crea la app Next.js, TypeScript estricto, Tailwind, Vitest, Testing Library, Playwright y scripts de calidad. El sitio aún no tiene diseño ni contenido real: solo debe arrancar y demostrar que el pipeline de pruebas existe.

```text
Eres un ingeniero senior. Implementa el PASO 01 del laboratorio web de Srod Almenara. Lee SPEC.md (no lo reescribas). Producto en español. No implementes páginas de contenido, CMS, motion ni formularios.

OBJETIVO
Dejar un proyecto Next.js (App Router) + TypeScript strict + Tailwind CSS que arranca, con arnés de pruebas listo. Este paso SOLO crea cimientos. El código de producto se limita a una Home mínima que renderiza el wordmark "Srod Almenara" para que las pruebas de humo tengan un ancla real.

STACK Y HERRAMIENTAS
- Next.js App Router (versión LTS estable actual), React, TypeScript strict (no loosen).
- Tailwind CSS.
- ESLint (config Next, vía CLI de ESLint: `next lint` no existe en Next 16) + scripts npm: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`.
- Vitest + @testing-library/react + jsdom para unit/component.
- Playwright para e2e, carpeta tests/e2e.
- Alias `@/*` → `src/*`.
- Estructura: src/app, src/components, src/content, src/domain, src/lib, src/styles, tests/e2e, public.

TDD (obligatorio, en este orden)
1. Crea tests/e2e/smoke.spec.ts que espera HTTP 200 en `/` y el texto visible "Srod Almenara".
2. Crea una prueba de componente o de página (Vitest) que renderice la Home y encuentre un heading o enlace con "Srod Almenara".
3. Implementa lo mínimo para que ambas pasen: layout raíz en español (`lang="es"`), página `/` con el wordmark, globals Tailwind.
4. Añade una prueba Vitest de configuración: `tsconfig` paths `@/` resuelve (importa un módulo `src/lib/site.ts` que exporta `SITE_NAME = "Srod Almenara"` y úsalo en la Home; no dejes `site.ts` sin importar).

REQUISITOS
- `src/lib/site.ts` exporta constantes de marca usadas por la Home: SITE_NAME, SITE_LANG = "es".
- Layout raíz: metadata title provisional "Srod Almenara", html lang=es.
- No instales Sanity, Motion, Resend, Turnstile ni analítica todavía.
- README: cómo instalar, `npm test`, `npm run test:e2e`, `npm run dev`. No dupliques SPEC.md.
- .env.example vacío o solo con comentarios de variables futuras; no inventes secretos.
- .gitignore de Next + Playwright.
- No uses App Router en `pages/`.

INTEGRACIÓN
La Home importa SITE_NAME. El layout importa globals.css de Tailwind. Playwright usa baseURL local.

FUERA DE ALCANCE
Header, footer, tokens de marca, rutas extra, CMS, copy largo.

DEFINICIÓN DE HECHO
- `npm test` pasa.
- `npx playwright test` (smoke) pasa.
- `npm run lint` y `npm run build` pasan.
- No hay archivos huérfanos: todo lo creado se usa en app o en test.
```

---

## Paso 02 — Tokens de diseño y superficie de galería clara

Define el sistema visual (color, tipo, espacio, radio, sombra de “caja de galería”) sobre UI luminosa, inspirado en el canal @srodmode, no en Squarespace. Aplícalo al layout y a la Home ya existentes.

```text
Eres un ingeniero senior. Implementa el PASO 02. Lee SPEC.md §3 (identidad visual) y el código del PASO 01. No copies el sitio Squarespace actual. Look claro / galería: fondos claros, aire, foto/video en cajas limpias. Extrae una paleta razonable a partir de la identidad pública del canal YouTube @srodmode (thumbnails, wordmark, acentos) y sistematízala para web clara. Tono tech-nerd preciso, no influencer.

OBJETIVO
Crear tokens de diseño e integrarlos en Tailwind y en la Home/layout actuales para que el sitio ya se sienta estudio claro. Sin header completo aún.

TDD (obligatorio)
1. Añade src/styles/tokens.test.ts (o equivalente Vitest) que importe las constantes de tokens y verifique:
   - existen color.bg, color.surface, color.ink, color.muted, color.accent, color.accentInk;
   - el fondo es claramente luminoso (documenta en comentario del test que bg no es un dark canvas);
   - existen font.display, font.body, radius.gallery, shadow.gallery, space de sección.
2. Prueba de componente: un componente GalleryBox (creado en este paso) envuelve children y aplica clases/tokens de “caja de galería” (radio + sombra + fondo surface). Testing Library comprueba el rol/contenido y una clase o data-attribute estable `data-ui="gallery-box"`.
3. Actualiza la prueba de Home del paso 01: el wordmark sigue visible y ahora está dentro de un layout que usa el fondo tokenizado (por ejemplo el body o un wrapper `data-ui="studio-shell"`).

IMPLEMENTACIÓN
- src/styles/tokens.ts: objeto TS exportado (fuente de verdad) + src/styles/tokens.css con las mismas CSS variables. Tailwind mapea a esas variables (no hardcodees hex sueltos en componentes).
- src/components/GalleryBox.tsx usado en la Home para enmarcar el wordmark (integración real, no Storybook huérfano).
- Tipografía: un display + un body con next/font (latin + caracteres españoles). Cárgalos en el layout raíz.
- Añade :focus-visible global (anillo de foco contrastado sobre UI clara).
- Comenta en tokens.ts que la música/guitarra no aporta paleta.

INTEGRACIÓN
Home y layout raíz consumen tokens + GalleryBox + fuentes. No crees una ruta /dev/tokens.

FUERA DE ALCANCE
Header, footer, motion, páginas nuevas, CMS.

DEFINICIÓN DE HECHO
Tests nuevos y anteriores pasan. build pasa. Ningún color mágico fuera del sistema de tokens.
```

---

## Paso 03 — Dominio Zod, fixtures de calidad y repositorio de contenido

Introduce el contrato de datos de `siteSettings`, `project` y `kitItem`, con fixtures que parecen sitio real, y un `ContentRepository` que las páginas usarán a partir de ahora.

```text
Eres un ingeniero senior. Implementa el PASO 03. Lee SPEC.md §5 y §6 (modelos y campos). Integra con el código existente. Este paso no construye páginas nuevas de IA; deja el puerto de datos listo y demuestra que la Home ya lee siteSettings (titular placeholder).

OBJETIVO
Fuente de verdad de contenido en la app: esquemas Zod + fixtures + ContentRepository. La Home deja de hardcodear el titular: lo lee del repositorio.

TDD (obligatorio)
1. Pruebas de esquema (Vitest) en src/domain/*.test.ts:
   - SiteSettings, Project y KitItem parsean los fixtures.
   - Un project sin título, slug, año, video YouTube, galería o contexto FALLA.
   - Campos geek opcionales (cámara, lentes, iluminación, look, notas, codec, pipeline) pueden omitirse.
   - kitItem sin foto es válido; sin nombre o sin nota de uso no lo es.
   - siteSettings permite "dónde encontrarme" vacío y enlace de música opcional.
   - destacados de home: 2 o 3 slugs que existen en fixtures; teaser de kit: 2 o 3 ids existentes.
2. Pruebas del repositorio src/content/repository.test.ts:
   - getSiteSettings() devuelve el titular.
   - getProjects() devuelve entre 3 y 8 proyectos, ordenables.
   - getProjectBySlug("slug-inexistente") → null.
   - getFeaturedProjects() respeta los slugs de settings y el orden.
   - getKitItems() respeta orden manual.
   - getKitTeaser() devuelve 2–3 piezas referenciadas en settings.
3. Actualiza la prueba de Home: muestra el titular y subtítulo provenientes de settings (no un string hardcodeado distinto al fixture).

IMPLEMENTACIÓN — CAMPOS EXACTOS
siteSettings: heroTitle, heroSubtitle, contactEmail, youtubeUrl, instagramUrl, youtubeFeedCount, whereaboutsText (nullable/empty ok), shopUrl, musicUrl opcional, formCcEmail opcional, featuredProjectSlugs (2–3), kitTeaserIds (2–3), aboutExcerpt, aboutBody (para /sobre más adelante), portrait (asset path placeholder).
project (capa cliente obligatoria): title, slug (español, kebab), client, role, year, youtubeVideoId, stills (min 1), summary.
project (opcionales geek): camera, lenses, lighting, look, whyNotes, codec, pipeline, extraBlocks[].
project: order, featured flag opcional (la home usa settings.featuredProjectSlugs como fuente de destacados).
kitItem: id, name, photo opcional, usageNote, order.

FIXTURES (calidad de lanzamiento)
- 5 proyectos (dentro de 3–8) de DP/comercial/lookbook, nombres creíbles, slugs en español, YouTube IDs dummy documentados, stills en /public/placeholders/ (esta carpeta la estrenas aquí).
- De esos 5, **cuatro con ficha técnica rica** (cámara, lentes, iluminación, look, notas) y **uno sin ningún campo geek**. El paso 11 necesita ese caso para probar que el toggle no aparece; déjalo listo ahora en vez de reescribir fixtures después.
- 6 piezas de kit (p. ej. Sony FX3, un prime, un zoom, luz, monitor, audio) con “por qué” corto, no specs de fabricante.
- Copy de hero: evolución del tagline “Un DP bien geek que hace videos en YouTube” (DP + geek + cámaras/proceso; YouTube como prueba, no definición entera).
- aboutExcerpt corto; contacto srod@srodalmenara.com; YT https://www.youtube.com/c/srodmode; shopUrl al sitio actual de presets (https://www.srodalmenara.com/ o path /presets — documenta la URL en el fixture).
- Ubicación Panamá + remoto vive en aboutBody, NO en el hero.

PUERTO
src/content/types.ts (interface ContentRepository)
src/content/fixtures.ts
src/content/fixture-repository.ts
src/content/index.ts exporta `content: ContentRepository` (instancia fixtures).
src/domain/schemas.ts + tipos inferidos.

INTEGRACIÓN
La página `/` es async y llama getSiteSettings() para titular/subtítulo. SITE_NAME sigue en src/lib/site.ts. Sustituye el párrafo de relleno que el paso 02 dejó hardcodeado en la Home (el que menciona Panamá): la ubicación vive en aboutBody, nunca en el gancho.

FUERA DE ALCANCE
Sanity, header, páginas /trabajo /kit /sobre /contacto, embeds reales de feed.

DEFINICIÓN DE HECHO
Todas las pruebas de dominio y repositorio pasan. Home muestra titular del fixture. No hay modelos “por si acaso” fuera de SPEC.md.
```

---

## Paso 04 — Mapa de rutas, metadata en español y 404

Crea todas las rutas de la IA como páginas stub integradas al layout, con titles/descriptions únicos, para que la navegación posterior tenga destinos reales.

```text
Eres un ingeniero senior. Implementa el PASO 04. Lee SPEC.md §4 (arquitectura de información) y el código existente. No diseñes el contenido completo de cada página; deja stubs honestos que ya usan el repositorio donde aplique.

OBJETIVO
Todas las rutas de fase 1 existen, responden 200, tienen metadata única en español y un h1 propio. 404 personalizado. Sitemap/robots aún no (van en el paso 20).

RUTAS (exactas)
- `/` (ya existe; no la vacíes)
- `/trabajo`
- `/trabajo/[slug]` — al menos el primer fixture resuelve; slug desconocido → notFound()
- `/kit`
- `/sobre`
- `/contacto`
- `/privacidad`

TDD (obligatorio)
1. Extiende tests/e2e/smoke.spec.ts: cada ruta de la tabla anterior (usando un slug real de fixtures para el case) devuelve 200 y un h1 distintivo.
2. e2e o request: `/trabajo/este-slug-no-existe` devuelve 404 y muestra el copy del not-found propio, no la pantalla por defecto de Next.
3. Vitest de un helper src/lib/metadata.ts: `pageTitle(segment)` produce titles únicos tipo "Trabajo — Srod Almenara", "Kit — Srod Almenara", etc. Home usa el patrón del hero o "Srod Almenara" + titular, sin duplicar el mismo title en todas las rutas.
4. Prueba de generateStaticParams o de getProjectBySlug en la página de case: slugs de fixtures cubiertos.

IMPLEMENTACIÓN
- Stubs con h1 + un párrafo corto en español que describa el rol de la página (no lorem). /trabajo puede listar títulos como enlaces ya (barato e integra el repositorio); si listas, usa getProjects() — no inventes un segundo array.
- /trabajo/[slug]: muestra al menos title del project o notFound(). En Next 16 `params` es una promesa: `const { slug } = await params`, también dentro de generateMetadata.
- src/app/not-found.tsx: 404 propio en español, con el mismo lienzo tokenizado y un enlace de vuelta a `/` y a `/trabajo`. Sin él, el "404 personalizado" del objetivo no existe.
- Layout raíz: no dupliques nav todavía si no existe (el header es el paso 05); sí puedes poner un <main id="contenido"> para skip link futuro.
- Metadata export en cada page (title + description). Descriptions útiles, no vacías.

INTEGRACIÓN
Las páginas de trabajo/kit leen el ContentRepository. Nada de fetch a APIs externas.

FUERA DE ALCANCE
Header/footer visual, toggle ficha, formulario funcional, motion, JSON-LD, sitemap.

DEFINICIÓN DE HECHO
Smoke e2e cubre el mapa de IA. Un slug inválido es 404. Cada página tiene title único. Stubs no están huérfanos: están en src/app y enlazables por URL.
```

---

## Paso 05 — Chrome: header, footer y skip link

Navegación compacta y footer global, alimentados por `siteSettings`, integrados en el layout raíz.

```text
Eres un ingeniero senior. Implementa el PASO 05. Lee SPEC.md §4 (nav y footer). Usa tokens del paso 02 y siteSettings del repositorio. Integra en el layout raíz para que TODAS las rutas ganen chrome de una vez.

OBJETIVO
Header compacto + footer global + skip link, responsive desde 360px, teclado-usable.

HEADER
- Wordmark "Srod Almenara" → `/`.
- Links de texto: Trabajo, Kit, Sobre, Contacto (rutas exactas).
- Iconos YouTube e Instagram (enlaces externos, `rel` adecuado, nombres accesibles en español, no solo icono mudo).
- URLs de redes desde getSiteSettings(), no hardcodeadas en el JSX.
- Estado activo del link de sección (aria-current="page").
- En viewport estrecho: patrón de nav usable (disclosure/button con aria-expanded). No copies hamburguesa inaccesible.

FOOTER
- YouTube, Instagram.
- Otras redes: solo si existen en settings (añade campos opcionales extraSocials[] al schema Zod + fixture; si no hay, no inventes una fila vacía). Si añades el campo, actualiza pruebas de dominio del paso 03.
- Enlace discreto "Presets" → shopUrl (tienda vieja; texto "Presets", no e-commerce nuevo).
- Enlace opcional música solo si musicUrl está definido; si el fixture lo deja vacío, no renderices el enlace.
- Enlace "Privacidad" → /privacidad.
- No hay look de músico.

SKIP LINK
"Saltar al contenido" visible al foco, apunta a #contenido.

TDD (obligatorio)
1. Pruebas de componente Header: render con settings de fixture; presencia de los 4 destinos internos + 2 externos; wordmark href="/"; aria-current en un pathname simulado /kit.
2. Pruebas Footer: Presets apunta a shopUrl; Privacidad a /privacidad; música ausente si musicUrl vacío; presente si se pasa un url.
3. Prueba del menú móvil: el botón tiene aria-expanded y el panel se abre/cierra.
4. Actualiza e2e smoke: desde `/` se puede activar el link "Trabajo" y aterrizar en /trabajo (click real).

IMPLEMENTACIÓN
src/components/Header.tsx, Footer.tsx. Layout raíz async: obtiene settings una vez y los pasa (no fetches duplicados por componente si puedes evitarlo). main#contenido envuelve children.

ACCESIBILIDAD
Contraste de links sobre fondo claro. Foco visible (ya hay :focus-visible). Targets táctiles razonables.

FUERA DE ALCANCE
Motion de ruta, feeds, formulario, Studio.

DEFINICIÓN DE HECHO
Todas las páginas existentes muestran el mismo header/footer. e2e navega Trabajo. Tests de Header/Footer pasan. Cero URLs de redes hardcodeadas en el chrome.
```

---

## Paso 06 — Primitivas de UI y YouTubeEmbed

Componentes compartidos que las páginas van a usar de inmediato: secciones, enlaces y embed de YouTube con chrome mínimo, poster y sin autoplay con audio.

```text
Eres un ingeniero senior. Implementa el PASO 06. Lee SPEC.md §3 Motion/rendimiento de video y §5 (video de cases vs feed del canal). Integra las primitivas en Home y en /trabajo/[slug] (el case stub ya existe) para que no queden componentes huérfanos.

OBJETIVO
Kit mínimo de UI + YouTubeEmbed correcto. Aún no construyas el resto de secciones de Home ni la ficha técnica.

COMPONENTES (todos usados en una página real al final del paso)
- Section: wrapper de bloque de página con heading opcional (h2) y aria-labelledby si hay título.
- TextLink / ButtonLink: enlace interno o externo con estilos de token; externos con indicador accesible.
- YouTubeEmbed:
  - Recibe videoId + título accesible (obligatorio).
  - Poster still (next/image o img con dimensiones para evitar CLS). No descarga el iframe hasta interacción del usuario (click en play real <button>), O iframe lazy con poster encima — elige facades; el botón de play debe ser un <button> real, no un div clickable.
  - Iframe: youtube-nocookie, modestbranding=1, rel=0 si la API de embed lo permite, autoplay solo tras gesto del usuario, MUTED no como truco para autoplay de hero con sonido. Cero autoplay con audio.
  - No 4K: usa thumbnail mqdefault/hqdefault o still local de /public/placeholders.
  - data-ui="youtube-embed".

TDD (obligatorio)
1. YouTubeEmbed: sin iframe en el primer render; hay un button "Reproducir …" (nombre accesible que incluye el título del video). Tras click (userEvent), aparece iframe con src que contiene el videoId, youtube-nocookie, modestbranding=1, y NO contiene autoplay=1 antes del gesto. Si tras el gesto usas autoplay=1, debe ser solo entonces y el título del iframe debe existir.
2. YouTubeEmbed: si falta título, TypeScript/Zod de props no lo permite (props schema o tipo estricto; prueba de que el componente exige title).
3. Section: el h2 está asociado.
4. Integración: la Home usa YouTubeEmbed con el video del hero (añade heroYoutubeVideoId a siteSettings Zod + fixture + tests de dominio que se rompieron — actualízalos). El case /trabajo/[slug] usa YouTubeEmbed con project.youtubeVideoId. Actualiza pruebas de Home y, si existe, una prueba de la página de case.

RENDIMIENTO
Poster con width/height o aspect-ratio reservado. Nada de layout shift obvio (prueba: el wrapper tiene aspect-ratio o padding conocido, assert de estilo/clase).

FUERA DE ALCANCE
Feed de últimos N videos, Instagram, toggle ficha, Motion/GSAP, autoplay de fondo.

DEFINICIÓN DE HECHO
Home y case renderizan el embed facade. Tests de embed pasan. GalleryBox (paso 02) puede envolver el embed en el case. No hay iframe YouTube crudo duplicado fuera de YouTubeEmbed.
```

---

## Paso 07 — Home: hero cinemático (contenido, aún sin motion de ruta)

Hero de Home con video, nombre, titular y subtítulo CMS. El motion cinematográfico de transiciones de página llega en el paso 20; aquí el hero ya debe sentirse estudio + reel (video en caja, aire, tipografía).

```text
Eres un ingeniero senior. Implementa el PASO 07. Lee SPEC.md §5 Home (solo el hero) y §3 verbal. No implementes el resto de bloques de Home (about, cases, IG, kit, CTA) todavía — si ya hay un titular suelto, incorpóralo al hero y deja el resto de la Home sin secciones nuevas.

OBJETIVO
La Home abre como laboratorio de un DP: wordmark/nombre, titular y subtítulo desde siteSettings, player discreto del video hero (no listado o público) vía YouTubeEmbed.

COPY
- Titular: evolución del tagline, ya en fixtures; no lo cambies a SEO local de Panamá.
- Subtítulo: oficio + proceso/cámaras; YouTube es prueba.
- No pongas “basado en Panamá” en el hero.

TDD (obligatorio)
1. Prueba de Home (Vitest, mock del repositorio o fixtures reales): aparecen SITE_NAME, heroTitle, heroSubtitle y el YouTubeEmbed (data-ui="youtube-embed").
2. Prueba negativa: el hero (sección `data-ui="hero"`) no contiene las cadenas "Panamá" ni "Panama".
3. e2e: `/` muestra el titular del fixture y un botón de reproducir.

IMPLEMENTACIÓN
- Sección Hero en src/components/home/Hero.tsx, usada solo por src/app/page.tsx.
- Composición: GalleryBox + YouTubeEmbed + headings. Jerarquía: un h1 (nombre o titular; elige una y sé consistente con metadata). Si el h1 es el titular, el nombre puede ser p/p-lead; no dos h1.
- El video hero NO es el feed del canal; usa heroYoutubeVideoId de settings.

INTEGRACIÓN
page.tsx obtiene settings y renderiza Hero. Header ya está en layout; no lo dupliques.

FUERA DE ALCANCE
Parallax, page transitions, extracto about, grid IG, lista de videos del canal, kit teaser, CTA.

DEFINICIÓN DE HECHO
Hero integrado en `/`. Tests cubren copy CMS y ausencia de ubicación en el gancho. Resto de Home intacto (sin rellenar aún).
```

---

## Paso 08 — Home: bloques editoriales y huecos de feeds

Completa la Home según SPEC §5, con Instagram y YouTube feed como huecos bien diseñados que enlazan al canal/perfil (los datos vivos llegan en pasos 18–19).

```text
Eres un ingeniero senior. Implementa el PASO 08. Lee SPEC.md §5 Home (todo excepto el hero, que ya existe). Integra bloques en `/` usando el ContentRepository. No implementes RSS ni widgets reales todavía.

OBJETIVO
Home completa en IA: extracto About, 2–3 cases destacados, teaser de kit, bloque “dónde encontrarme”, CTA contacto, mención discreta Presets, y dos huecos etiquetados para IG y YouTube que degradan a enlaces fuertes.

BLOQUES (orden razonable, tono no agresivo)
1. Extracto About (aboutExcerpt) + TextLink a /sobre.
2. Destacados: getFeaturedProjects() — 2 o 3, no todos. Cada uno: título, cliente o año, enlace a /trabajo/[slug], still en GalleryBox.
3. Hueco Instagram `data-ui="instagram-teaser"`: título de sección en español + enlace al perfil (instagramUrl). Texto de que el grid de posts vivirá aquí. No fingas 9 posts falsos como si fueran API.
4. Hueco YouTube `data-ui="youtube-teaser"`: CTA "Ver el canal" (youtubeUrl) + nota de últimos videos. No listes videos fake.
5. Teaser kit: getKitTeaser(), 2–3 piezas con nombre + nota “por qué” + enlace a /kit.
6. whereaboutsText: si vacío, no renderices el bloque; si hay texto, bloque CMS corto.
7. CTA a /contacto, discreto (no “¡CONTRÁTAME YA!”).
8. Presets: enlace discreto a shopUrl (puede vivir aquí o solo footer; si está en Home, que sea ligero).

TDD (obligatorio)
1. Home test: aboutExcerpt visible y link /sobre.
2. Exactamente N destacados = featuredProjectSlugs.length; cada href /trabajo/{slug}.
3. Kit teaser count = kitTeaserIds.length; link /kit.
4. whereabouts: con texto se muestra; con settings mockeado vacío, `data-ui="whereabouts"` no está en el documento.
5. instagram-teaser y youtube-teaser contienen los href de settings.
6. CTA href=/contacto.
7. e2e: desde `/` click en el primer destacado llega al case.

IMPLEMENTACIÓN
Componentes en src/components/home/* importados por page.tsx. Nada de fetch externo. Reutiliza Section, GalleryBox, TextLink.

FUERA DE ALCANCE
Behold, YouTube RSS, Sanity, motion de página, formulario.

DEFINICIÓN DE HECHO
Una visita a `/` cubre la IA de Home de la spec, con feeds como huecos honestos. Todas las piezas salen del repositorio. Tests anteriores del hero siguen verdes.
```

---

## Paso 09 — Índice /trabajo

Página índice de 3–8 case studies profundos: no un grid masivo de thumbs tipo banco de imágenes.

```text
Eres un ingeniero senior. Implementa el PASO 09. Lee SPEC.md §4–5 (Trabajo). Sustituye el stub de /trabajo por el índice real. Usa getProjects().

OBJETIVO
/trabajo lista todos los proyectos del repositorio (3–8) con jerarquía de estudio, no masonry infinito. Cada entrada lleva a /trabajo/[slug].

UI
- h1 “Trabajo” (o copy equivalente sobrio).
- Lista o grid amplio (pocas columnas, mucho aire). Por ítem: still principal, título, cliente/proyecto, rol, año, enlace.
- No muestres la ficha técnica aquí.
- Enlace opcional “Ver todos” no aplica: esta YA es la lista completa. Home tiene el subconjunto.

TDD (obligatorio)
1. Prueba de página / componente WorkIndex: renderiza un artículo/enlace por proyecto fixture; order respeta project.order.
2. No renderiza slugs duplicados.
3. Cada card tiene alt en el still (español, no filename).
4. e2e: /trabajo muestra los títulos de los 5 fixtures y el click en uno abre el case.

IMPLEMENTACIÓN
src/components/work/WorkIndex.tsx usado por src/app/trabajo/page.tsx. Metadata ya existía; ajústala si el copy del stub cambió.

FUERA DE ALCANCE
Filtros, búsqueda, paginación, toggle geek, CMS.

DEFINICIÓN DE HECHO
Índice integrado en la ruta. Home destacados y este índice leen la misma fuente. Tests e2e de navegación pasan.
```

---

## Paso 10 — Case study: capa cliente

Página `/trabajo/[slug]` completa en su capa por defecto (cliente): video, stills, contexto. Sin toggle geek todavía.

```text
Eres un ingeniero senior. Implementa el PASO 10. Lee SPEC.md §5 Case studies — capa cliente. Sustituye el stub del case. generateStaticParams desde getProjects(). notFound() si slug desconocido (ya cubierto; no lo rompas).

OBJETIVO
Un cliente profesional entiende el trabajo: título, cliente/proyecto, rol de Srod, año, video YouTube, galería de stills, resultado/contexto corto. Misma URL que usará la ficha después.

UI
- Capa cliente visible por defecto (`data-ui="case-client"`).
- YouTubeEmbed con título accesible derivado del project.title.
- Galería de stills en GalleryBox; alts en español.
- CTA discreto a /contacto (el diagrama de IA lo permite).
- Link de vuelta a /trabajo.

TDD (obligatorio)
1. Render de un fixture conocido: todos los campos obligatorios visibles.
2. stills.length imágenes (o botones/figure) en la galería.
3. Slug desconocido: notFound (prueba de la función de load o e2e 404 ya existente).
4. No muestres etiquetas de ficha técnica (Cámara, Codec, etc.) todavía aunque el fixture tenga esos campos — se añaden en el paso 11. Añade un assert de que `data-ui="case-geek"` no existe.

IMPLEMENTACIÓN
src/components/work/CaseStudy.tsx + src/app/trabajo/[slug]/page.tsx. `params` es una promesa (Next 16): `await` en la página y en generateMetadata. ISR: `export const revalidate` razonable (p. ej. 60) para alinearse con Vercel/ISR de la spec, aunque los datos aún sean fixtures.

FUERA DE ALCANCE
Toggle, Sanity, related videos de YouTube, páginas extra.

DEFINICIÓN DE HECHO
Cases navegables desde Home y /trabajo. Video facade. Tests cubren campos cliente y ausencia de capa geek.
```

---

## Paso 11 — Ficha técnica (toggle, misma URL)

Capa geek detrás de un toggle accesible por teclado. Campos opcionales: si faltan, no se inventan filas vacías.

```text
Eres un ingeniero senior. Implementa el PASO 11. Lee SPEC.md §5 capa geek. No crees /trabajo/[slug]/ficha ni query param obligatorio; el toggle es UI en la misma URL.

OBJETIVO
Quien quiera profundidad técnica puede abrir “Ficha técnica”. Quien no, se queda en la capa cliente. Teclado + lector de pantalla.

UI/A11Y
- Botón real “Ficha técnica” (aria-expanded, aria-controls).
- Panel `data-ui="case-geek"` hidden cuando collapsed (hidden attribute o CSS + visibilidad consistente con a11y; si usas hidden, el contenido no debe ser tabulable).
- Por teclado: Enter/Espacio alternan. Foco visible.
- Renderiza solo campos opcionales presentes: cámara, lentes, iluminación, look/color, notas de por qué, codec, pipeline, extraBlocks.
- Si un proyecto no tiene NINGÚN campo geek, el botón no aparece (o aparece disabled con explicación); cubre esto con un fixture: elige 1 de los 5 proyectos sin campos geek y los otros con ficha rica. Actualiza fixtures + tests de dominio si hace falta.

TDD (obligatorio)
1. userEvent.click / keyboard: expanded true, panel visible, campos esperados.
2. Segundo click: collapsed, panel no visible.
3. Proyecto sin ficha: no hay botón (assert).
4. e2e en un case con ficha: tab hasta el botón, Enter, se ve “cámara” o el label en español que elijas (usa labels en español: Cámara, Lentes, etc.).

IMPLEMENTACIÓN
src/components/work/TechSheetToggle.tsx integrado en CaseStudy. Client component mínimo; el resto puede seguir en Server Component.

FUERA DE ALCANCE
URL distinta, PDF, comparador de cámaras, motion elaborado (un fade corto CSS ok; no GSAP aún).

DEFINICIÓN DE HECHO
Criterio de aceptación 3 de SPEC §11 cubierto a nivel de feature. Tests de teclado pasan. Capa cliente intacta.
```

---

## Paso 12 — Página /kit

Lista de equipo con el “por qué”, orden manual, foto opcional. No catálogo de fabricante.

```text
Eres un ingeniero senior. Implementa el PASO 12. Lee SPEC.md §5 Kit. Sustituye el stub de /kit. Fuente: getKitItems().

OBJETIVO
Entender el kit de Srod como decisiones de oficio, no como spec sheet.

UI
- h1 Kit.
- Lista ordenada por `order`.
- Cada pieza: nombre, usageNote, foto opcional en GalleryBox. Sin foto: no hay icono roto; el bloque tipográfico basta.
- Tono preciso (para qué la usa), no marketing de Sony.

TDD (obligatorio)
1. El orden en el DOM coincide con order ascendente (usa data-id en cada ítem).
2. Un kitItem fixture sin photo no renderiza <img>.
3. Todos los nombres y notas visibles.
4. e2e: /kit muestra al menos 3 nombres conocidos del fixture.

IMPLEMENTACIÓN
src/components/kit/KitList.tsx + page. Metadata en español.

FUERA DE ALCANCE
Precios, affiliate, filtros, CMS.

DEFINICIÓN DE HECHO
/kit cumple criterio 4 de aceptación. Teaser de Home y esta lista comparten fixtures. Sin huérfanos.
```

---

## Paso 13 — Página /sobre

Bio completa, retrato, Panamá + remoto, una sola mención a la música. Tono híbrido DP + geek.

```text
Eres un ingeniero senior. Implementa el PASO 13. Lee SPEC.md §1–2 y §5 About. Sustituye el stub de /sobre. Contenido desde siteSettings (aboutBody, portrait, musicUrl opcional) y, si hace falta, campos extra en Zod: origin, howHeWorks, whoItsFor — O un aboutBody en Markdown/MDX simple. Prefiere campos estructurados mínimos ya previstos (aboutBody largo en fixture, portrait). Si aboutBody es un string con párrafos separados por \n\n, ríndelos como <p>. No instales un blog engine.

OBJETIVO
El visitante profesional entiende quién es, cómo trabaja, para quién, y que opera desde Panamá con disponibilidad remota/internacional. Un fan reconoce la personalidad @srodmode. La música se menciona UNA vez, sin galería.

TDD (obligatorio)
1. Página muestra aboutExcerpt o arranque de aboutBody, retrato con alt en español.
2. Contiene “Panamá” (o "Panama" si aparece en copy; usa “Panamá” en el fixture) Y una mención a trabajo remoto o internacional, FUERA del hero (esta es /sobre).
3. Si musicUrl existe, exactamente un enlace de música en el main de /sobre O remite al footer; assert: no hay sección `data-ui="music-gallery"` ni lista de tracks.
4. No hay grid de presets ni CTA de tienda agresivo.
5. e2e: /sobre carga retrato y un enlace a /contacto.

COPY DE FIXTURE
Escribe aboutBody de calidad (origen, oficio geek de cámaras/color/proceso, para quién es su DP, Panamá + remoto). Actualiza pruebas de dominio si el string es requerido y ya lo era.

INTEGRACIÓN
page.tsx → getSiteSettings(). Reusa Section, GalleryBox. Header/footer ya cubren redes.

FUERA DE ALCANCE
Timeline, blog, i18n, dark mode, Instagram grid (si lo pones, solo el mismo hueco del paso 08; preferible no duplicar).

DEFINICIÓN DE HECHO
Criterios 1 y 5 (redes vía chrome) reforzados. Música contenida. Tests pasan.
```

---

## Paso 14 — Contacto (UI) y privacidad mínima

Formulario visible sin login, email de respaldo con copiar + mailto, redes núcleo, página /privacidad. Aún no se envía correo real.

```text
Eres un ingeniero senior. Implementa el PASO 14. Lee SPEC.md §5 Contacto y Privacidad, §7 legal. Sustituye stubs de /contacto y /privacidad. El POST real es el paso 15; aquí el form tiene action/method y validación de cliente, más un handler que por ahora puede no existir — en ese caso el form usa action="/api/contacto" method="POST" ya, y una prueba de cliente no depende del 200 del API. Añade un test del API 404/not implemented SOLO si la ruta no existe: mejor crea `src/app/api/contacto/route.ts` que responda 501 JSON { ok: false } para que el contrato de URL exista. El paso 15 lo reemplaza.

OBJETIVO
UI de contacto completa y página de privacidad mínima. Anti-spam visual: campo honeypot oculto (no rellenar). Sin Turnstile widget todavía (paso 15), pero deja un contenedor `data-ui="turnstile-slot"` vacío documentado.

FORMULARIO (nombres de campos estables)
- nombre, email, organizacion, tipoProyecto, fechas, mensaje
- honeypot: campo `empresa_url` (o company_website) oculto con label "No rellenar", autocomplete=off, tabIndex=-1, aria-hidden
- labels visibles en español, asociados con htmlFor
- botón submit "Enviar"
- línea de privacidad: los datos solo se usan para responder, enlace a /privacidad

EMAIL DE RESPALDO
- Visible: settings.contactEmail
- Botón "Copiar" (aria-live al copiar) + enlace mailto:
- Prueba del botón copiar con clipboard mock

UBICACIÓN Y DISPONIBILIDAD
SPEC §2 coloca "basado en Panamá + remoto / internacional" en About **y en contacto** (nunca en el hero). Añade en el aside de /contacto una línea corta de ubicación y disponibilidad remota. Si la quieres editable, usa un campo opcional `availabilityNote` en siteSettings (Zod + fixture + pruebas de dominio del paso 03, y schema de Sanity en el paso 16); si no, tómala de aboutBody. Elige una sola fuente y no dupliques el texto.

REDES
YouTube + Instagram desde settings, en el main de contacto además del header.

TDD (obligatorio)
1. Cada input requerido tiene label. Query byLabelText para todos.
2. HTML5/aria: email type=email; submit presente.
3. Honeypot no visible (toBeNull en getByRole o class sr-only + not toBeVisible).
4. Copiar email: mock navigator.clipboard.writeText.
5. /privacidad: texto mínimo en español sobre el formulario (qué se recoge, para qué, que no hay cookies de marketing de este form). No política genérica anglosajona de 40 páginas.
6. e2e: /contacto muestra el email de respaldo y el form.
7. /contacto menciona Panamá y disponibilidad remota o internacional (SPEC §2).

IMPLEMENTACIÓN
src/components/contact/ContactForm.tsx (client) + ContactAside.tsx. page.tsx server obtiene settings.

FUERA DE ALCANCE
Resend, Turnstile script, rate limit, login.

DEFINICIÓN DE HECHO
Criterio 6 en su parte de UI. /privacidad enlazada desde form y footer. Contrato /api/contacto existe (501). Tests de labels y honeypot pasan.
```

---

## Paso 15 — API de contacto: validación, honeypot, Turnstile y Resend

Cierra el envío real con defensa en profundidad. Un sistema externo a la vez en capas, pero un solo paso de producto: “el formulario llega al correo”.

```text
Eres un ingeniero senior. Implementa el PASO 15. Lee SPEC.md §5 Contacto (anti-spam, CC opcional). Sustituye el 501 de /api/contacto. No toques otras páginas salvo el form para Turnstile y estados de éxito/error.

OBJETIVO
POST /api/contacto valida, descarta bots (honeypot + Turnstile), envía email a Srod vía Resend, CC opcional a settings.formCcEmail / env.

TDD (obligatorio) — mockea fetch de Turnstile y el SDK de Resend; NUNCA envíes correo real en test.
1. Body inválido (email mal, mensaje vacío) → 400, Resend no llamado.
2. Honeypot con valor → 200 { ok: true } (silencioso) y Resend no llamado.
3. Turnstile token ausente o verify false → 400/403, Resend no llamado.
4. Turnstile ok + payload válido → Resend.emails.send llamado con to = contactEmail, from de env, replyTo = email del visitante, subject útil en español, body con todos los campos; si formCcEmail existe, cc incluye ese valor.
5. Fallo de Resend → 500, mensaje genérico al cliente (no filtrar el error interno).
6. Componente form: al submit exitoso (mock fetch) muestra confirmación en español y no pierde el email de respaldo en la página.
7. Widget Turnstile: en test de componente, mockea el script; el form no envía sin token (estado).

IMPLEMENTACIÓN
- Zod del payload en src/domain/contact.ts (reusa en API y, si quieres, en cliente).
- src/lib/turnstile.ts verify(token, secret, ip).
- src/lib/mail.ts sendContactEmail(...).
- route.ts: lee settings vía repositorio para to/cc (en test, mock content.getSiteSettings).
- Env: RESEND_API_KEY, RESEND_FROM, TURNSTILE_SECRET_KEY, NEXT_PUBLIC_TURNSTILE_SITE_KEY. Actualiza .env.example con placeholders vacíos y comentarios.
- En desarrollo sin claves: documenta en README que el form no envía; opcionalmente si falta API key en NODE_ENV=development responde 503 claro — pero en test las claves están mockeadas.

SEGURIDAD
No loguees el mensaje completo en prod. Rate limit simple en memoria por IP (documenta límite); prueba que el exceso responde 429.

INTEGRACIÓN
ContactForm POST a /api/contacto con FormData o JSON (elige uno y teséa ese). Turnstile en el slot del paso 14.

FUERA DE ALCANCE
Auth, attachments, CRM, Slack.

DEFINICIÓN DE HECHO
Pruebas del route cubren bot, validación, éxito y fallo. UI de éxito integrada. Sin secretos commiteados.
```

---

## Paso 16 — Sanity: schemas y Studio embebido

Alinea Sanity a los esquemas Zod existentes. Studio en `/studio` para que Srod edite sin código. Aún no sustituyas el adapter de fixtures en las páginas públicas (eso es el paso 17), pero el Studio debe leer/escribir los mismos campos.

```text
Eres un ingeniero senior. Implementa el PASO 16. Lee SPEC.md §6. Los shapes de src/domain/schemas.ts son la plantilla. No rediseñes campos. No migres aún el ContentRepository público a Sanity (sigue fixtures en src/content/index.ts) para no romper el sitio si el proyecto Sanity no está autenticado en CI.

OBJETIVO
Studio embebido en Next (`/studio`) con tres modelos: siteSettings (singleton), project, kitItem. Preview/producción documentados. Tests de schema (objetos de schema exportados) para que no se deslicen campos.

TDD (obligatorio)
1. Tests Vitest que importan los schema defs y comprueban name/type y la presencia de TODOS los campos del Zod (lista explícita de field names para project, kitItem, siteSettings).
2. Test: siteSettings es singleton (un documento; pattern document + id fijo o plugin singleton).
3. e2e opcional skippeable si no hay token: al menos la ruta /studio responde (puede redirigir a login de Sanity — assert status 200 o 302, no 404). Marca este e2e como skip si SANITY_PROJECT_ID no está en env.

IMPLEMENTACIÓN
- Dependencias oficiales next-sanity / sanity.
- src/sanity/schemas/* y index.
- Studio route src/app/studio/[[...tool]]/page.tsx (o la convención actual de next-sanity).
- sanity.config.ts en raíz o src.
- Validaciones en schema equivalentes a Zod (required vs optional).
- Orden manual: campo order number en project y kitItem.
- Destacados home: references a project (max 3) y kitItem (max 3), no slugs sueltos si puedes usar references — PERO entonces el adapter del paso 17 mapeará a slugs/ids del dominio. Documenta el mapeo en un comentario. Alternativa: mantener slugs en el singleton para paridad 1:1 con Zod. Elige paridad 1:1 con Zod (featuredProjectSlugs, kitTeaserIds) para minimizar el pico de este paso.
- .env.example: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_READ_TOKEN (comentario: token público de lectura).
- robots: /studio noindex (metadata robots: noindex en el layout del studio).

INTEGRACIÓN
Link "Studio" NO en el header público. Solo documentado en README. El sitio público sigue en fixtures.

FUERA DE ALCANCE
Adapter de producción, seeds automáticos masivos, webhooks complejos (ISR webhook puede quedar TODO comentado para el paso 17).

DEFINICIÓN DE HECHO
Tests de paridad schema↔Zod pasan. /studio existe. Páginas públicas intactas (fixtures). README: cómo crear el proyecto Sanity y pegar env.
```

---

## Paso 17 — Adapter Sanity detrás del mismo puerto + placeholders

Las páginas públicas leen Sanity cuando hay env; si no, fixtures. ISR + mapeo GROQ. Seed de documentos placeholder documentado.

```text
Eres un ingeniero senior. Implementa el PASO 17. El puerto ContentRepository NO cambia su API pública. Añade SanityRepository y un factory que elige adapter por env. Las páginas siguen importando `content` desde src/content.

OBJETIVO
Srod puede cambiar titular, un project y un kitItem en Studio y verlos en el lab (con revalidate). CI y `npm test` siguen usando fixtures (forzar adapter fixture en NODE_ENV=test).

TDD (obligatorio)
1. factory.test.ts: sin PROJECT_ID → fixture repo; con env mock y un client mock → sanity repo.
2. Mapper: un documento GROQ ficticio (JSON) se convierte en Project/SiteSettings válido según Zod; documentos incompletos se rechazan (log + skip), no tiran toda la Home.
3. Tests de páginas existentes siguen verdes con fixtures (NODE_ENV=test).
4. Un test del sanity client construye queries GROQ esperadas (snapshot o includes `*[_type == "project"]`).

IMPLEMENTACIÓN
- src/sanity/queries.ts, client.ts, mapper.ts, sanity-repository.ts.
- ISR: revalidate en pages que fetchean content; opcional route /api/revalidate protegida por secret (prueba: sin secret 401; con secret 200). Si implementas revalidate, intégralo: el README dice cómo poner el webhook de Sanity. No dejes la route sin documentar ni sin test.
- Script `npm run seed:sanity` (tsx) que upserta los fixtures al dataset; idéntico contenido placeholder. El script vive en src/sanity/seed.ts, usa el token write. En test, el seed no corre. Documenta que se ejecuta a mano.
- Nunca commitees tokens.

DEGRADACIÓN
Si Sanity falla en runtime (red), captura error y usa fixtures SOLO si ENABLE_FIXTURE_FALLBACK=true; en producción por defecto mejor error de página que mostrar fixtures viejos por accidente. En desarrollo, fallback ok. Cubre esto con un test del factory/repository wrapper.

FUERA DE ALCANCE
Custom input widgets, AI, traducciones.

DEFINICIÓN DE HECHO
Mismo puerto, dos adapters. Tests unitarios del mapper. README: seed + webhook ISR. Sitio en test = fixtures.
```

---

## Paso 18 — Feed YouTube (últimos N) con degradación

Sustituye el hueco `youtube-teaser` de Home por últimos N videos + CTA al canal. Si el fetch falla, el CTA permanece.

```text
Eres un ingeniero senior. Implementa el PASO 18. Lee SPEC.md §5 Proceso/YouTube. Plan A: RSS del canal (no requiere API key). N = siteSettings.youtubeFeedCount (sugerido 6–9 en fixture). Integra en el bloque Home existente (mismo data-ui, ahora con lista).

OBJETIVO
Ventana viva al canal @srodmode. Distinta del embed de cases/hero. Falla → CTA "Ver el canal".

TDD (obligatorio)
1. Parser RSS: XML fixture de 3 entries → 3 { id, title, thumbnail, url, publishedAt }.
2. Limita a N aunque el RSS traiga más.
3. Fetch mock 500 o throw → getYoutubeFeed() devuelve { ok: false, videos: [] }; el componente muestra el CTA y NO una lista vacía fingida de cards rotas.
4. Fetch ok → N cards con link externo y thumbnail; cada card tiene título accesible.
5. Home test actualizado: con repo mock de feed ok aparecen videos; con fail, el enlace al canal sigue.

IMPLEMENTACIÓN
src/lib/youtube-feed.ts (fetch + cache Next: revalidate 3600). src/components/home/YoutubeWindow.tsx reemplaza el teaser hueco. Player: al click, puedes enlazar a YouTube (más simple, menos autoplay) O reusar YouTubeEmbed. Prefiere enlace a YouTube + thumb para no cargar N iframes; el hero/cases siguen con embed. Documenta la decisión en comentario breve.

Canal: extrae channel id o usa la URL RSS pública documentada junto a youtubeUrl. Si hace falta CHANNEL_ID en settings, añade campo opcional youtubeChannelId al Zod + Sanity schema + tests de paridad schema (paso 16). No dejes un ID mágico solo en un componente.

FUERA DE ALCANCE
YouTube Data API extra, comentarios, likes, recatalogar el canal como blog.

DEFINICIÓN DE HECHO
Home muestra ventana o degradación. Tests de parser y fallo cubiertos. Hueco del paso 08 ya no es un placeholder vacío.
```

---

## Paso 19 — Grid Instagram con widget inyectable y plan B

Sustituye el hueco IG. La API oficial de Meta no es el camino. Widget mantenido (Behold u equivalente) detrás de un puerto, con fallback a enlace fuerte.

```text
Eres un ingeniero senior. Implementa el PASO 19. Lee SPEC.md §5 Redes (Instagram). No intentes Graph API ni app review.

OBJETIVO
Grid de últimos posts en Home. Si el widget/servicio falla o no hay token, quedan los enlaces de header/home/contacto.

TDD (obligatorio)
1. Puerto InstagramFeed { getPosts(): Promise<Post[]> } con adapter `config` (env BEHOLD_FEED_URL o similar) y adapter `empty`.
2. Componente InstagramGrid: con posts mock (6) renderiza tantas figuras/enlaces; alts; links externos.
3. Con posts = []: no muestra grid roto; muestra mensaje breve + enlace al perfil (instagramUrl).
4. Fetch mock fail → empty + fallback UI.
5. Home integra el grid en `data-ui="instagram-teaser"` (mismo ancla).

IMPLEMENTACIÓN
- src/lib/instagram.ts
- Documenta en README (sección Operaciones): renovación de token/widget, qué env falta, plan B (solo enlace). Esto es parte del paso, no “docs después”, porque la spec lo exige.
- Placeholders: si no hay env en dev, usa el fallback (no inventes 9 fotos de Unsplash como si fueran el feed real; el fallback honesto ya se diseñó).
- Cero secretos en git.

FUERA DE ALCANCE
Publicar en IG, stories, scraping.

DEFINICIÓN DE HECHO
Grid o fallback, ambos testeados. README de token. Header IG sigue funcionando.
```

---

## Paso 20 — SEO, motion con reduced-motion, analítica y aceptación e2e

Cierra calidad de lanzamiento: descubribilidad, ritmo cinemático respetuoso, analítica sin cookies de marketing, viaje de aceptación de SPEC §11, y documentación operativa. Es el único paso “ancho”, pero cada sub-bloque trae pruebas y no introduce CMS ni páginas nuevas.

```text
Eres un ingeniero senior. Implementa el PASO 20 (cierre). Lee SPEC.md §3 Motion, §7 SEO/analítica, §9 calidad, §11 criterios de aceptación. No añadas e-commerce, blog, dark mode ni i18n. Trabaja por sub-bloques con pruebas en cada uno antes del siguiente.

SUB-BLOQUE A — SEO y descubribilidad
- `metadataBase` en el layout raíz a partir de `NEXT_PUBLIC_SITE_URL` (con fallback a https://www.srodalmenara.com y a la URL de preview de Vercel). Sin base absoluta, las OG cards y el sitemap salen con rutas relativas y no sirven. Añade la variable a .env.example.
- title/description únicos (ya hay helper; revisa Home, case, kit, sobre, contacto, privacidad).
- OG/Twitter: still del hero en Home; still principal del case en /trabajo/[slug]. `openGraph.locale = "es"`.
- sitemap.ts y robots.txt (allow público, disallow /studio, sitemap url).
- Favicon e iconos de app: `src/app/icon` + `apple-icon` (o favicon.ico en public) con el wordmark/acento de los tokens del paso 02. Es lo único que quedaba pendiente de `public/` en el árbol de carpetas. Ojo: en Next 16 estos ficheros reciben `params` como promesa si los generas con código.
- slugs ya en español.
- JSON-LD Person en layout o Home (DP, nombre, url, sameAs YT/IG).
- JSON-LD CreativeWork en cada case (nombre, fecha/año, video, imagen).
TDD A:
- Tests de generateMetadata de un case (og image definida y absoluta).
- Test de sitemap: incluye /, /trabajo, cada slug fixture, /kit, /sobre, /contacto, /privacidad; no incluye /studio ni /presets.
- Test de JSON-LD: script type=application/ld+json parseable y @type correcto (Person y CreativeWork).

SUB-BLOQUE A2 — Continuidad de la tienda vieja
SPEC §4 y §8 exigen preservar `/presets` (o `shop.`) hacia el sitio actual para no romper compras; hasta ahora eso solo vivía como nota de README y como enlace de footer.
- `redirects()` en next.config.ts: `/presets` → URL de la tienda actual (permanente=false mientras la migración esté sin decidir, para no cachear un 308 que luego moleste). Documenta la URL en un único sitio; no la dupliques en el JSX.
- No uses `proxy.ts` para esto (Next 16 renombró middleware y aquí no hace falta).
TDD A2:
- Test del array de redirects importado desde next.config.ts (origen `/presets`, destino = URL documentada), o e2e que compruebe el 3xx y el `location`.
- El e2e de aceptación sigue afirmando que no existe checkout propio: el redirect no es e-commerce nuevo.

SUB-BLOQUE B — Motion
- Transiciones de ruta corte/fade con Motion. Parallax suave SOLO en hero still/video wrapper, no en texto de formulario.
- src/lib/motion.ts lee prefers-reduced-motion: si reduce, duración 0 / no parallax / no transiciones largas.
TDD B:
- Helper reduced-motion: con matchMedia mock reduce, variants de animación tienen duration 0 o opacity-only.
- No animes el foco ni skip link.
- Video hero sigue sin autoplay con audio.

SUB-BLOQUE C — Analítica
- Plausible: script oficial condicionado a NEXT_PUBLIC_PLAUSIBLE_DOMAIN. Sin él, no inyectes script.
TDD C: layout test — sin env, no hay script plausible; con env, hay script con data-domain.

SUB-BLOQUE D — Performance video (guardas)
- YouTubeEmbed ya es facade; verifica lazy en thumbs del feed (loading=lazy).
- Prueba: feed thumbs tienen loading="lazy".

SUB-BLOQUE E — E2E de aceptación (Playwright, fixtures)
Un spec tests/e2e/acceptance.spec.ts que recorre:
1. Home: se entiende el oficio (titular visible).
2. Abre un case con video facade y stills.
3. Abre ficha técnica por teclado o click.
4. /kit muestra piezas con “por qué”.
5. Links YouTube e Instagram visibles (header).
6. /contacto: rellena el form (honeypot vacío). Mockea API o usa modo test del route.
Además: viewport 360px en un spec `mobile`: Home y un case no desbordan horizontalmente de forma grosera (assert document width vs viewport, tolerancia mínima).
Tienda vieja: footer Presets visible y href = shopUrl.
No existe ruta /blog ni /eventos ni checkout.

SUB-BLOQUE F — Docs
README actualizado: stack, env completo, CMS (Studio, seed), Instagram token, Turnstile, Resend, Plausible, cutover DNS (srodalmenara.com → Vercel; preservar presets/Squarespace). No escribas un segundo SPEC.
Añade además una **checklist de aceptación manual** para los criterios de SPEC §11 que ningún test con fixtures puede demostrar: con Sanity conectado, cambiar el titular, un proyecto y una pieza de kit en Studio y verlos en el lab **sin deploy** (revalidate o webhook del paso 17). Deja escrito qué se mira y en qué orden; es el criterio con el que Srod acepta la fase 1.

INTEGRACIÓN
Todo vive en layout, metadata, componentes ya usados. Cero demos /playground.

DEFINICIÓN DE HECHO
`npm test`, e2e acceptance y build pasan. Criterios SPEC §11 cubiertos por e2e o tests de componente equivalentes. Motion respeta reduced-motion. SEO artifacts presentes. El lab es un sitio único integrado, no una colección de prototipos.
```

---

## Checklist de integración (anti-huérfanos)

Antes de dar por cerrado un paso, verifica:

| Pregunta | Respuesta esperada |
|---|---|
| ¿Este archivo lo importa una ruta, layout, adapter o test? | Sí |
| ¿Las pruebas anteriores siguen verdes? | Sí |
| ¿Hay un sistema externo nuevo? | Como máximo uno por paso (excepto el 15 y el 20, ya acotados) |
| ¿El copy es lorem/ipsum? | No |
| ¿Se implementó el paso siguiente “por adelantado”? | No |
| ¿Sanity y la UI discrepan en campos? | No: Zod manda |
| ¿`npm run lint`, `npm run typecheck` y `npm run build` pasan? | Sí, los tres |
| ¿Se leyó `params`, `searchParams` o `cookies()` sin `await`? | No: en Next 16 son promesas |
| ¿El paso deja algo de SPEC.md sin cubrir y sin nota en Estado de avance? | No |

---

## Qué no debe aparecer en ningún prompt ejecutado

- Carrito, checkout, entrega de presets  
- Calendario de eventos, blog, i18n, dark mode, app nativa, login de clientes  
- Rebrand del canal de música o galería musical  
- Copiar el diseño Squarespace  
- Google Analytics / cookies de marketing  
- WebGL  
- Meta Graph API como plan A de Instagram  
- APIs que Next 16 ya eliminó o renombró: `next lint`, `middleware.ts`, `unstable_cache`, `params`/`searchParams`/`cookies()` síncronos, `revalidateTag` con un solo argumento  

---

## Orden sugerido de conversaciones con el LLM

Una conversación (o un PR) por paso, nombrada `paso-01` … `paso-20`. Tras el 20, el criterio de “laboratorio público fase 1” está cerrado: Srod puede sustituir placeholders en Sanity y publicar.
