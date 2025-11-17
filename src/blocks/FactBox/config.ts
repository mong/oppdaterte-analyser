import type { Block } from 'payload'

import {
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FactBox: Block = {
  slug: 'factBox',
  fields: [
    {
      name: 'text',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, InlineToolbarFeature()]
        },
      }),
      required: true,
    },
  ],
  interfaceName: 'FactBoxBlock',
}
