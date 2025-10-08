import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Container } from '@mui/material'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const rapporter = await payload.find({
    collection: 'rapporter',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      tags: true,
      meta: true,
    },
  })


  return (
    <>
      <Container maxWidth="xl">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Rapporter</h1>
        </div>
        <PageRange
          collection="rapporter"
          currentPage={rapporter.page}
          limit={12}
          totalDocs={rapporter.totalDocs}
        />
        <CollectionArchive rapporter={rapporter.docs} />

        {rapporter.totalPages > 1 && rapporter.page && (
          <Pagination page={rapporter.page} totalPages={rapporter.totalPages} />
        )}
      </Container>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Rapporter`,
  }
}
