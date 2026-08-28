import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SITE_LANG, SITE_NAME } from "@/lib/site";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: SITE_NAME,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE_LANG}>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
