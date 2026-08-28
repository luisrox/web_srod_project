import { GalleryBox } from "@/components/GalleryBox";
import { SITE_NAME } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-section">
      <GalleryBox as="section" className="px-8 py-section-sm sm:px-12">
        <p className="text-sm font-medium tracking-[0.2em] text-muted uppercase">
          Laboratorio
        </p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          {SITE_NAME}
        </h1>
        <p className="mt-4 max-w-prose text-muted">
          Dirección de fotografía desde Panamá. Cámaras, lentes y color, con el
          proceso a la vista.
        </p>
      </GalleryBox>
    </main>
  );
}
