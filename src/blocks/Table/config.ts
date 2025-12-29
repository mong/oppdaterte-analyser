import type { Block } from 'payload'

import {
  lexicalEditor,
  EXPERIMENTAL_TableFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

export const Table: Block = {
  slug: 'table',
  fields: [
    {
      name: 'table',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ }) => {
          return [
            EXPERIMENTAL_TableFeature(),
          ]
        },
      }),
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            InlineToolbarFeature(),
          ]
        },
      }),
      required: false,
    },
  ],
  interfaceName: 'TableBlock',
}
