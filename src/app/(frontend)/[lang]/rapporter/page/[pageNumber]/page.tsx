import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { Lang } from '@/types'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string;
    lang: Lang;
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber, lang } = await paramsPromise;
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const rapporter = await payload.find({
    collection: 'rapporter',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Rapporter</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="rapporter"
          currentPage={rapporter.page}
          limit={12}
          totalDocs={rapporter.totalDocs}
        />
      </div>

      <CollectionArchive rapporter={rapporter.docs} lang={lang} />

      <div className="container">
        {rapporter?.page && rapporter?.totalPages > 1 && (
          <Pagination page={rapporter.page} totalPages={rapporter.totalPages} lang={lang} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Website Template Rapporter Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'rapporter',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
