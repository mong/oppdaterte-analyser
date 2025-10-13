import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

export const ResultBox: Block = {
  slug: 'resultBox',
  fields: [
    {
      name: 'media',
      required: true,
      label: "JSON",
      type: "relationship",
      relationTo: 'datafiler',
      filterOptions: async ({ data, req }) => {

        const media = await req.payload.find({
          collection: "datafiler",
          where: {
            and: [
              { folder: { exists: true } },
              { folder: { equals: data.folder } }
            ]
          },
          pagination: false,
          depth: 0,
          select: {},
        })
        return {
          mimeType: { equals: "application/json" },
          id: { in: media.docs.map(d => d.id) }
        }
      },
    },
    {
      name: 'kart',
      required: true,
      label: "Kart",
      type: "relationship",
      relationTo: 'datafiler',
      filterOptions: {
        and: [
          { folder: { exists: true } },
          { 'folder.name': { equals: "kart" } },
          { mimeType: { equals: "application/geo+json" } }
        ]
      },
      defaultValue: async ({ req }) => {
        const kart = await req.payload.find({
          collection: "datafiler",
          where: {
            and: [
              { 'folder.name': { equals: "kart" } },
              { filename: { equals: "kart_2024.geojson" } }
            ],
          },
          pagination: false,
          limit: 1,
          select: {}
        })
        return kart?.docs?.[0]?.id
      },
    },
    {
      name: 'diskusjon',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), UploadFeature(), InlineToolbarFeature()]
        },
      }),
      label: "Diskusjon",
      required: true,
    },
    {
      name: 'utvalg',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, InlineToolbarFeature()]
        },
      }),
      label: "Utvalg",
      required: true,
    },
  ],
  interfaceName: 'ResultBoxBlock',
}
