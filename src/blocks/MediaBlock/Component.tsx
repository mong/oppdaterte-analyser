import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    imgClassName,
    media,
    staticImage,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <figure className="mx-auto max-w-[80%]">
      {(media || staticImage) && (
        <Media
          imgClassName={imgClassName}
          resource={media}
          src={staticImage}
        />
      )}
      {caption && (
        <figcaption className={'mt-6'}>
          <RichText data={caption} enableGutter={false} />
        </figcaption>
      )}
    </figure>
  )
}
