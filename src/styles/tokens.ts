/**
 * Fuente de verdad del sistema visual (SPEC §3).
 *
 * Look claro / galería: papel luminoso, tinta casi negra y un acento ámbar
 * quemado tomado de la identidad pública del canal @srodmode (thumbnails y
 * wordmark tiran a naranja cálido sobre neutros). No se copia el sitio
 * Squarespace actual: aquí hay sistema, allí no.
 *
 * El canal de música / guitarra no aporta paleta a esta web (SPEC §3, §10).
 *
 * Cada token vive también como variable CSS en tokens.css con el prefijo
 * `--srod-<grupo>-<token>`; tokens.test.ts verifica que ambos archivos no se
 * separen. Tailwind mapea esas variables en globals.css, así que ningún
 * componente debería escribir un hex suelto.
 */

export const color = {
  /** Lienzo del sitio: papel cálido, no blanco de laboratorio. */
  bg: "#f7f5f2",
  /** Cara de las cajas de galería (stills, video, fichas). */
  surface: "#ffffff",
  /** Texto principal. */
  ink: "#171512",
  /** Texto secundario: créditos, metadatos, ficha técnica. */
  muted: "#5e574e",
  /** Bordes finos de caja y separadores. */
  line: "#e6e1d9",
  /** Acento de marca: enlaces, CTA y anillo de foco. */
  accent: "#b23d18",
  /** Texto sobre el acento. */
  accentInk: "#ffffff",
} as const;

export const font = {
  display: 'var(--font-srod-display), "Trebuchet MS", system-ui, sans-serif',
  body: "var(--font-srod-body), system-ui, -apple-system, sans-serif",
} as const;

export const radius = {
  gallery: "1rem",
} as const;

export const shadow = {
  gallery:
    "0 1px 2px rgba(23, 21, 18, 0.05), 0 18px 40px -24px rgba(23, 21, 18, 0.28)",
} as const;

export const space = {
  section: "clamp(4rem, 8vw, 7rem)",
  sectionSm: "clamp(2.5rem, 5vw, 4rem)",
} as const;

export const tokens: Record<string, Record<string, string>> = {
  color,
  font,
  radius,
  shadow,
  space,
};
