/** Límite en memoria por IP. No sobrevive a varios nodos ni a un restart. */
export const CONTACT_RATE_LIMIT_MAX = 5;
export const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type Bucket = { timestamps: number[] };

const hits = new Map<string, Bucket>();

export function resetContactRateLimit(): void {
  hits.clear();
}

export function consumeContactRateLimit(
  ip: string,
  now = Date.now(),
): boolean {
  const bucket = hits.get(ip) ?? { timestamps: [] };
  const cutoff = now - CONTACT_RATE_LIMIT_WINDOW_MS;
  bucket.timestamps = bucket.timestamps.filter((stamp) => stamp > cutoff);

  if (bucket.timestamps.length >= CONTACT_RATE_LIMIT_MAX) {
    hits.set(ip, bucket);
    return false;
  }

  bucket.timestamps.push(now);
  hits.set(ip, bucket);
  return true;
}
