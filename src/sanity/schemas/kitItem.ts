import { defineField, defineType } from "sanity";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const kitItemType = defineType({
  name: "kitItem",
  title: "Pieza de kit",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Id público",
      description: "Kebab en minúsculas. Paridad 1:1 con Zod `kitItem.id`.",
      type: "string",
      validation: (rule) =>
        rule.required().regex(slugPattern, { name: "slug" }),
    }),
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Foto (ruta o URL)",
      type: "string",
    }),
    defineField({
      name: "usageNote",
      title: "Para qué la usa",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      validation: (rule) => rule.required().integer(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "id" },
  },
  orderings: [
    {
      title: "Orden manual",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
