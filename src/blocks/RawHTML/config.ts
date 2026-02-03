import type { Block } from 'payload'

export const RawHTML: Block = {
  slug: 'rawHTML',
  labels: {
    singular: 'Raw HTML',
    plural: 'Raw HTML',
  },
  fields: [
    {
      name: 'html',
      type: 'code',
      required: true,
    },
  ],
  interfaceName: 'RawHTMLBlock',
}
