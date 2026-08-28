import { Inter, Space_Grotesk } from "next/font/google";

/**
 * Los nombres de variable llevan prefijo `srod` para no chocar con el espacio
 * `--font-*` que Tailwind reserva en @theme. tokens.css las consume.
 */

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-srod-display",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-srod-body",
});

export const fontVariables = `${display.variable} ${body.variable}`;
