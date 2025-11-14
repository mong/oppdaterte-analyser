'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Rapporter } from '@/payload-types'

import { Media } from '@/components/Media'
import { Lang } from '@/types'

export type CardPostData = Pick<Rapporter, 'slug' | 'tags' | 'bilde' | 'title' | 'meta'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'rapporter'
  showTags?: boolean
  title?: string
  lang: Lang
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showTags, title: titleFromProps, lang } = props

  const { slug, tags, bilde, meta, title } = doc || {}
  const { description, } = meta || {}

  const hasTags = tags && Array.isArray(tags) && tags.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${lang}/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'rounded-[1.5rem] overflow-hidden hover:cursor-pointer',
        'hover:shadow-lg transition-shadow duration-100 bg-[#e3f3ef] hover:[&_picture]:opacity-[0.8]',
        '[&_a]:no-underline hover:[&_a]:underline',
        className,
      )}
      ref={card.ref}
    >
      <div className="max-h-[350px] overflow-hidden">
        {!bilde && <div className="">No image</div>}
        {bilde && typeof bilde !== 'string' && <Media resource={bilde} size="33vw" />}
      </div>
      <div className="p-4">
        {showTags && hasTags && (
          <div className="uppercase text-sm mb-4">
            {showTags && hasTags && (
              <div>
                {tags?.map((tag, index) => {
                  if (typeof tag === 'object') {
                    const { title: titleFromTag } = tag

                    const tagTitle = titleFromTag || 'Untitled tag'

                    const isLast = index === tags.length - 1

                    return (
                      <Fragment key={index}>
                        {tagTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    )
                  }

                  return null
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose text-inherit" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
