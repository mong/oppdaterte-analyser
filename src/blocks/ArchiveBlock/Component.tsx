import type { Rapporter, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, tags, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let rapporter: Rapporter[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedTags = tags?.map((tag) => {
      if (typeof tag === 'object') return tag.id
      else return tag
    })

    const fetchedRapporter = await payload.find({
      collection: 'rapporter',
      depth: 1,
      limit,
      ...(flattenedTags && flattenedTags.length > 0
        ? {
          where: {
            tag: {
              in: flattenedTags,
            },
          },
        }
        : {}),
    })

    rapporter = fetchedRapporter.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedRapporter = selectedDocs.map((rapport) => {
        if (typeof rapport.value === 'object') return rapport.value
      }) as Rapporter[]

      rapporter = filteredSelectedRapporter
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive rapporter={rapporter} />
    </div>
  )
}
