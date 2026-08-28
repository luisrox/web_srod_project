import { SITE_NAME } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {SITE_NAME}
      </h1>
    </main>
  );
}
