import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { ResultBox } from '../../blocks/ResultBox/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateAnalyse } from './hooks/revalidateAnalyse'


import { slugField } from '@/fields/slug'

export const Analyser: CollectionConfig = {
  slug: 'analyser',
  labels: {
    singular: 'Analyse',
    plural: 'Analyser',
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
    slug: true,
    tags: true,
    bilde: true,
    meta: {
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt', 'test'],
    livePreview: {
      url: ({ data, req, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'analyser',
          req,
          locale: locale.code,
        })
        return path
      },
    },
    preview: (data, { req, locale }) => generatePreviewPath({
      slug: typeof data?.slug === 'string' ? data.slug : '',
      collection: 'analyser',
      req,
      locale: locale,
    }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: {
        components: {
          Field: '@/components/SelectJSON',
        },
      },
      jsonSchema: {
        uri: 'a://b/foo.json', // required
        fileMatch: ['a://b/foo.json'], // required
        schema: {
          type: 'object'
        },
      },
    },
    {
      name: 'summary',
      type: 'richText',
      localized: true,
      editor: lexicalEditor(),
      label: "Oppsummering",
      required: true,
    },
    {
      name: 'discussion',
      type: 'richText',
      localized: true,
      editor: lexicalEditor(),
      label: "Diskusjon",
      required: true,
    },
    {
      name: 'about',
      type: 'richText',
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
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      localized: true,
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'select',
      options: ["SKDE", "Helse Førde"],
      required: true,
      defaultValue: "SKDE",
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: "norskType",
      label: "Norsktype",
      type: 'radio',
      options: [{ label: "Bokmål", value: "nb" }, { label: "Nynorsk", value: "nn" }],
      defaultValue: "nb",
      required: true,
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/NorskType',
        },
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'tags',
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
}
