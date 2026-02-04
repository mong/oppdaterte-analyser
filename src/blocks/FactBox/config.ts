import type { Block } from 'payload'

import {
  InlineToolbarFeature,
  lexicalEditor,
  BlocksFeature
} from '@payloadcms/richtext-lexical'
import { MediaBlock } from '../MediaBlock/config'
import { Table } from '../Table/config'
import { RawHTML } from '../RawHTML/config'

export const FactBox: Block = {
  slug: 'factBox',
  fields: [
    {
      name: 'text',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            InlineToolbarFeature(),
            BlocksFeature({ blocks: [Table, MediaBlock, RawHTML] }),
          ]
        },
      }),
      required: true,
    },
  ],
  interfaceName: 'FactBoxBlock',
}
