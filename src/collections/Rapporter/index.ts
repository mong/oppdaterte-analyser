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
import { FactBox } from '../../blocks/FactBox/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateRapport } from './hooks/revalidateRapport'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

export const Rapporter: CollectionConfig = {
  slug: 'rapporter',
  labels: {
    singular: 'Rapport',
    plural: 'Rapporter',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a rapport is referenced
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
          collection: 'rapporter',
          req,
          locale: locale.code,
        })
        return path
      },
    },
    preview: (data, { req, locale }) => generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'rapporter',
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
      name: 'folder',
      label: "Mappe",
      type: "relationship",
      relationTo: 'payload-folders',
      required: true
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'bilde',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [ResultBox, FactBox, Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description'
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
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
      name: 'relatedRapporter',
      type: 'relationship',
      localized: true,
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
      hasMany: true,
      relationTo: 'rapporter',
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
    afterChange: [revalidateRapport],
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
