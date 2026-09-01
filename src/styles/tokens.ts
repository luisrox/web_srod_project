/**
 * Fuente de verdad del sistema visual (SPEC §3, actualizado a set vivo).
 *
 * El lienzo es un set de nogal con practicals de tungsteno — el ritmo de los
 * videos de @srodmode, no un papel de laboratorio. Las cajas de galería siguen
 * siendo papel: stills y fichas se leen como copias sobre la mesa.
 *
 * `ink` / `muted` / `line` / `accent` viven en el set. `onSurface*` es la tinta
 * sobre el papel; `.bg-surface` las remapea para que las cajas no hereden
 * crema sobre blanco.
 *
 * El canal de música / guitarra no aporta paleta a esta web (SPEC §3, §10).
 *
 * Cada token vive también como variable CSS en tokens.css con el prefijo
 * `--srod-<grupo>-<token>`; tokens.test.ts verifica que ambos archivos no se
 * separen. Tailwind mapea esas variables en globals.css, así que ningún
 * componente debería escribir un hex suelto.
 */

export const color = {
  /** Lienzo del sitio: nogal quemado detrás de las luces. */
  bg: "#1c120c",
  /** Cara de las cajas de galería (stills, video, fichas). */
  surface: "#f3eee6",
  /** Texto sobre el set. */
  ink: "#f5e6d0",
  /** Texto secundario sobre el set: créditos, metadatos. */
  muted: "#cbb59c",
  /** Bordes y separadores sobre el set. */
  line: "#4a3428",
  /** Acento sobre el set: enlaces, CTA y anillo de foco. */
  accent: "#e3924f",
  /** Texto sobre el acento del set. */
  accentInk: "#1c120c",
  /** Tinta sobre el papel de galería. */
  onSurface: "#171512",
  /** Texto secundario sobre el papel. */
  onSurfaceMuted: "#5e574e",
  /** Bordes de caja sobre el papel. */
  onSurfaceLine: "#e6e1d9",
  /** Acento sobre el papel (mismo ámbar quemado del canal). */
  onSurfaceAccent: "#b23d18",
  /** Texto sobre el acento del papel. */
  onSurfaceAccentInk: "#ffffff",
  /** Practical de tungsteno del fondo vivo. */
  glow: "#f0b56a",
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
    "0 1px 2px rgba(0, 0, 0, 0.28), 0 22px 48px -18px rgba(0, 0, 0, 0.55), 0 0 40px -12px rgba(227, 146, 79, 0.22)",
} as const;

export const space = {
  section: "clamp(3rem, 6vw, 5rem)",
  sectionSm: "clamp(1.5rem, 3.2vw, 2.5rem)",
} as const;

export const tokens: Record<string, Record<string, string>> = {
  color,
  font,
  radius,
  shadow,
  space,
};
