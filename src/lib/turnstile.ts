const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type SiteverifyResponse = {
  success?: boolean;
};

export async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string,
): Promise<boolean> {
  if (!token || !secret) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const response = await fetch(SITEVERIFY_URL, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as SiteverifyResponse;
  return data.success === true;
}
