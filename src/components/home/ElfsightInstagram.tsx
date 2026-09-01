"use client";

import Script from "next/script";

import {
  ELFSIGHT_PLATFORM_SRC,
  elfsightAppClass,
} from "@/lib/elfsight";

type ElfsightInstagramProps = {
  widgetId: string;
};

export function ElfsightInstagram({ widgetId }: ElfsightInstagramProps) {
  return (
    <div data-ui="instagram-elfsight" className="mt-6">
      <div
        className={elfsightAppClass(widgetId)}
        data-elfsight-app-lazy
      />
      <Script src={ELFSIGHT_PLATFORM_SRC} strategy="lazyOnload" />
    </div>
  );
}
