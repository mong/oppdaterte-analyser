import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Rapporter } from '@/payload-types'

import { Media } from '@/components/Media'
import HeaderMiddle from '@/components/Header/HeaderMiddle'

export const RapportHero: React.FC<{
  rapport: Rapporter
}> = ({ rapport }) => {
  const { tags, author, publishedAt, title } = rapport

  return (
    <HeaderMiddle title={title}>
      <div className="text-sm my-4">
        {tags?.map((tag, index) => {
          if (typeof tag === 'object' && tag !== null) {
            const { title: tagTitle } = tag

            const titleToUse = tagTitle || 'Untitled tag'

            return (
              <span key={index} className="text-white bg-blue-900 rounded-xl p-2 mr-3">
                {titleToUse}
              </span>
            )
          }
          return null
        })}
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-16 mt-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm">Forfatter</p>
            <p>{author}</p>
          </div>
        </div>
        {publishedAt && (
          <div className="flex flex-col gap-1">
            <p className="text-sm">Publisert</p>
            <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
          </div>
        )}
      </div>
    </HeaderMiddle>
  )
}
