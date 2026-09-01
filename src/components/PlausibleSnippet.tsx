import Script from "next/script";

type PlausibleSnippetProps = {
  domain?: string;
};

export function PlausibleSnippet({
  domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
}: PlausibleSnippetProps) {
  const host = domain?.trim();
  if (!host) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={host}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
