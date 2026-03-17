import type { CollectionConfig } from 'payload';
import { Content } from '@/blocks/Content/config';
import { MediaBlock } from '@/blocks/MediaBlock/config';
import { RawHTML } from '@/blocks/RawHTML/config';

import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';

import { generatePreviewPath } from '../../utilities/generatePreviewPath';
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage';

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import {
  MetaDescriptionField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import { slugField } from '@/fields/slug';

import type { CollectionBeforeChangeHook } from 'payload';


export const populatePublishedAt: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (req.data && !req.data.publishedAt) {
      const now = new Date()
      return {
        ...data,
        publishedAt: now,
      };
    }
  }
  return data;
}


export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Side',
    plural: 'Sider',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
          locale: locale.code,
        })
        return path
      },
    },
    enableRichTextLink: false,
    preview: (data, { req, locale }) => generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
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
      name: "description",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [Content, MediaBlock, RawHTML],
              required: true,
              admin: {
                initCollapsed: true,
              },
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
      name: "publiseringsStatus",
      localized: true,
      index: true,
      label: "Publiseringsstatus",
      type: "radio",
      defaultValue: "test",
      options: [
        { label: "Publisert", value: "published" },
        { label: "Testversjon (bare de med link har tilgang)", value: "test" },
        { label: "Skjult", value: "hidden" },
      ],
      admin: {
        layout: "vertical",
        position: "sidebar",
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
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
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
  }
}

