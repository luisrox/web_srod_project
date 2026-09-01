import { defineField, defineType } from "sanity";

export const stillType = defineType({
  name: "still",
  title: "Still",
  type: "object",
  fields: [
    defineField({
      name: "src",
      title: "Ruta o URL",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const extraBlockType = defineType({
  name: "extraBlock",
  title: "Bloque extra",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Cuerpo",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
});

export const extraSocialType = defineType({
  name: "extraSocial",
  title: "Red extra",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Etiqueta",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
});
