import { defineField, defineType } from "sanity";

import { SITE_SETTINGS_DOCUMENT_ID } from "@/sanity/singleton";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;

export const siteSettingsType = defineType({
  name: SITE_SETTINGS_DOCUMENT_ID,
  title: "Ajustes del sitio",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titular",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Subtítulo",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactEmail",
      title: "Email de contacto",
      type: "email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "URL de YouTube",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youtubeChannelId",
      title: "ID de canal YouTube",
      description:
        "UC… para el RSS de Home (feeds/videos.xml?channel_id=). /c/ y @handle no alcanzan.",
      type: "string",
      validation: (rule) =>
        rule.regex(/^UC[A-Za-z0-9_-]{22}$/, { name: "youtubeChannelId" }),
    }),
    defineField({
      name: "instagramUrl",
      title: "URL de Instagram",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youtubeFeedCount",
      title: "N de videos del feed",
      type: "number",
      initialValue: 6,
      validation: (rule) => rule.required().integer().min(1).max(24),
    }),
    defineField({
      name: "whereaboutsText",
      title: "Dónde encontrarme",
      description: "Puede quedar vacío. No aparece en el hero.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "shopUrl",
      title: "URL de la tienda",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "musicUrl",
      title: "URL de música",
      type: "url",
    }),
    defineField({
      name: "extraSocials",
      title: "Otras redes",
      type: "array",
      of: [{ type: "extraSocial" }],
    }),
    defineField({
      name: "formCcEmail",
      title: "CC del formulario",
      type: "email",
    }),
    defineField({
      name: "availabilityNote",
      title: "Nota de ubicación (contacto)",
      type: "string",
    }),
    defineField({
      name: "heroYoutubeVideoId",
      title: "ID de video del hero",
      type: "string",
      validation: (rule) =>
        rule.required().regex(youtubeIdPattern, { name: "youtubeVideoId" }),
    }),
    defineField({
      name: "featuredProjectSlugs",
      title: "Destacados de home",
      description:
        "Paridad 1:1 con Zod: slugs kebab, no references. El adapter del paso 17 lee estos strings (2–3) tal cual.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) =>
        rule
          .required()
          .min(2)
          .max(3)
          .custom((value: string[] | undefined) => {
            if (!value) {
              return true;
            }
            const bad = value.find((slug) => !slugPattern.test(slug));
            return bad
              ? `Slug inválido: ${bad}. Usa kebab en minúsculas.`
              : true;
          }),
    }),
    defineField({
      name: "kitTeaserIds",
      title: "Teaser de kit",
      description:
        "Paridad 1:1 con Zod: ids kebab de kitItem, no references. El adapter del paso 17 los mapea a getKitItems().",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(2).max(3),
    }),
    defineField({
      name: "aboutExcerpt",
      title: "Extracto About",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aboutBody",
      title: "Cuerpo About",
      type: "text",
      rows: 12,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Retrato (ruta o URL)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});
