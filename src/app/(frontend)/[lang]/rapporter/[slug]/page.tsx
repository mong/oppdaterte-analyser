import type { Metadata } from 'next'

import { RelatedRapporter } from '@/blocks/RelatedRapporter/Component'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Rapporter } from '@/payload-types'

import { RapportHero } from '@/components/RapportHero'
import { generateMeta } from '@/utilities/generateMeta'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Container } from '@mui/material'
import { SelectionProvider } from '@/lib/SelectionContext'
import { notFound } from 'next/navigation'
import { Lang } from '@/types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const rapporter = await payload.find({
    collection: 'rapporter',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = rapporter.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
    lang: Lang
  }>
}

export default async function Rapport({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()

  const { slug = '', lang } = await paramsPromise
  const rapport = await queryRapportBySlug({ slug })

  if (!rapport) return notFound()

  return (
    <article className="pt-16 pb-16">
      {draft && <LivePreviewListener />}

      <RapportHero rapport={rapport} />

      <Container maxWidth="xl">
        <SelectionProvider>
          <RichText className="pt-4" data={rapport.content} enableGutter={false} />
          {rapport.relatedRapporter && rapport.relatedRapporter.length > 0 && (
            <RelatedRapporter
              lang={lang}
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={rapport.relatedRapporter.filter((rapport) => typeof rapport === 'object')}
            />
          )}
        </SelectionProvider>
      </Container>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const rapport = await queryRapportBySlug({ slug })

  return generateMeta({ doc: rapport })
}

const queryRapportBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'rapporter',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
