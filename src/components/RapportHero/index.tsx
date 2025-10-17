import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Rapporter } from '@/payload-types'

import HeaderMiddle from '@/components/Header/HeaderMiddle'
import TagList from '../TagList'
import { Lang } from '@/types'

export const RapportHero: React.FC<{
  rapport: Rapporter;
  lang: Lang;
}> = ({ rapport, lang }) => {
  const { tags, author, publishedAt, title } = rapport

  return (
    <HeaderMiddle title={title}>
      {tags &&
        <TagList
          tags={tags.filter((tag) => typeof tag === 'object' && tag !== null)}
          lang={lang}
        />}
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
