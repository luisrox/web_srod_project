import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StudioShell } from "@/components/StudioShell";
import { SITE_LANG, SITE_NAME } from "@/lib/site";
import { fontVariables } from "@/styles/fonts";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: SITE_NAME,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE_LANG} className={fontVariables}>
      <body>
        <StudioShell>{children}</StudioShell>
      </body>
    </html>
  );
}
