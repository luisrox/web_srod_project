import { expect, test } from "@playwright/test";

const hasSanityProject = Boolean(
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

test.describe("Studio embebido", () => {
  test.skip(
    !hasSanityProject,
    "sin SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID",
  );

  test("/studio responde (login de Sanity o el propio Studio), no 404", async ({
    request,
  }) => {
    const response = await request.get("/studio", { maxRedirects: 0 });

    expect([200, 302]).toContain(response.status());
  });
});
