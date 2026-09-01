import { revalidatePath } from "next/cache";

function authorized(request: Request): boolean {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return false;
  }

  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("secret");
  const fromHeader = request.headers.get("x-revalidate-secret");
  return fromQuery === expected || fromHeader === expected;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return Response.json({ ok: true, revalidated: true });
}

export function GET(request: Request) {
  return POST(request);
}
