import type { Block } from 'payload'

export const CSVTreeView: Block = {
  slug: 'csvTreeView',
  interfaceName: 'CSVTreeView',
  fields: [
    {
      name: 'csv',
      type: 'textarea',
      required: true,
    },
  ],
}
