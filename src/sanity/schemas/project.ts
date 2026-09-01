import { defineField, defineType } from "sanity";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;

export const projectType = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "string",
      validation: (rule) =>
        rule.required().regex(slugPattern, { name: "slug" }),
    }),
    defineField({
      name: "client",
      title: "Cliente / proyecto",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Rol de Srod",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Año",
      type: "number",
      validation: (rule) => rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: "youtubeVideoId",
      title: "ID de video YouTube",
      type: "string",
      validation: (rule) =>
        rule.required().regex(youtubeIdPattern, { name: "youtubeVideoId" }),
    }),
    defineField({
      name: "stills",
      title: "Stills",
      type: "array",
      of: [{ type: "still" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "summary",
      title: "Resultado / contexto",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "featured",
      title: "Destacado en home",
      type: "boolean",
    }),
    defineField({
      name: "camera",
      title: "Cámara",
      type: "string",
    }),
    defineField({
      name: "lenses",
      title: "Lentes",
      type: "string",
    }),
    defineField({
      name: "lighting",
      title: "Iluminación",
      type: "string",
    }),
    defineField({
      name: "look",
      title: "Look / color",
      type: "string",
    }),
    defineField({
      name: "whyNotes",
      title: "Por qué",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "codec",
      title: "Codec",
      type: "string",
    }),
    defineField({
      name: "pipeline",
      title: "Pipeline",
      type: "string",
    }),
    defineField({
      name: "extraBlocks",
      title: "Otros bloques",
      type: "array",
      of: [{ type: "extraBlock" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "client" },
  },
  orderings: [
    {
      title: "Orden manual",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
