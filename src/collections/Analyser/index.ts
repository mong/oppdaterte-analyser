import type { CollectionConfig } from "payload";
import type { JSONSchema4 } from "json-schema";

import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { authenticated } from "../../access/authenticated";
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished";
import { generatePreviewPath } from "../../utilities/generatePreviewPath";
import { revalidateDelete, revalidateAnalyse } from "./hooks/revalidateAnalyse";

import { slugField } from "@/fields/slug";

const textSchema: JSONSchema4 = {
  type: "object",
  required: ["en", "no"],
  additionalProperties: false,
  properties: {
    en: { type: "string" },
    no: { type: "string" },
  },
};

const numberTuple: JSONSchema4 = {
  type: "array",
  items: { type: "number" },
  minItems: 2,
  maxItems: 2,
};

const analyseSchema: JSONSchema4 = {
  type: "object",
  required: [
    "name",
    "age_range",
    "kjonn",
    "description",
    "generated",
    "views",
    "data",
  ],
  properties: {
    name: { type: "string" },
    age_range: numberTuple,
    kjonn: {
      enum: ["begge", "menn", "kvinner"],
    },
    kontakt_begrep: textSchema,
    kategori_begrep: textSchema,
    description: textSchema,
    generated: { type: "number" },
    views: {
      type: "array",
      items: {
        type: "object",
        required: [
          "name",
          "type",
          "aggregering",
          "year_range",
          "title",
          "variables",
        ],
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          type: { type: "string" },
          aggregering: { enum: ["kont", "pas", "begge"] },
          year_range: numberTuple,
          title: textSchema,
          variables: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["en", "no", "name"],
              additionalProperties: false,
              properties: {
                en: { type: "string" },
                no: { type: "string" },
                name: { type: "string" },
              },
            },
          },
        },
      },
    },
    data: {
      type: "object",
      patternProperties: {
        ".*": {
          type: "object",
          patternProperties: {
            ".*": {
              type: "object",
              patternProperties: {
                ".*": {
                  type: "object",
                  patternProperties: {
                    ".*": {
                      type: "object",
                      patternProperties: {
                        ".*": {
                          type: "object",
                          patternProperties: {
                            ".*": {
                              type: "number",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const Analyser: CollectionConfig = {
  slug: "analyser",
  labels: {
    singular: "Analyse",
    plural: "Analyser",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when an analyse is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    discussion: true,
    summary: true,
    about: true,
    slug: true,
    tags: true,
    bilde: true,
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt", "test"],
    livePreview: {
      url: ({ data, req, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === "string" ? data.slug : "",
          collection: "analyser",
          req,
          locale: locale.code,
        });
        return path;
      },
    },
    preview: (data, { req, locale }) =>
      generatePreviewPath({
        slug: typeof data?.slug === "string" ? data.slug : "",
        collection: "analyser",
        req,
        locale: locale,
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "data",
      type: "json",
      required: true,
      typescriptSchema: [
        ({ jsonSchema }) => {
          // Modify the JSON schema here
          console.log("JSON Schema::", jsonSchema);
          return jsonSchema;
        },
      ],
      admin: {
        components: {
          Field: "@/components/SelectJSON",
        },
      },
      jsonSchema: {
        uri: "a://b/foo.json", // required
        fileMatch: ["a://b/foo.json"], // required
        schema: analyseSchema,
      },
    },
    {
      name: "summary",
      type: "richText",
      localized: true,
      editor: lexicalEditor(),
      label: "Oppsummering",
      required: true,
    },
    {
      name: "discussion",
      type: "richText",
      localized: true,
      editor: lexicalEditor(),
      label: "Diskusjon",
      required: true,
    },
    {
      name: "about",
      type: "richText",
      localized: true,
      editor: lexicalEditor(),
      label: "Om analysen",
      required: true,
    },
    {
      name: "test",
      localized: true,
      label: "Test-versjon (ikke publisert på forsiden)",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      localized: true,
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "author",
      type: "select",
      options: ["SKDE", "Helse Førde"],
      required: true,
      defaultValue: "SKDE",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "norskType",
      label: "Norsktype",
      type: "radio",
      options: [
        { label: "Bokmål", value: "nb" },
        { label: "Nynorsk", value: "nn" },
      ],
      defaultValue: "nb",
      required: true,
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/NorskType",
        },
      },
    },
    {
      name: "tags",
      type: "relationship",
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "tags",
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateAnalyse],
    afterRead: [],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};
