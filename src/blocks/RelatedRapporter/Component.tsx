import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Rapporter } from '@/payload-types'

import { Card } from '../../components/Card'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Lang } from '@/types'

export type RelatedRapporterProps = {
  className?: string
  docs?: Rapporter[]
  introContent?: SerializedEditorState
  lang: Lang
}

export const RelatedRapporter: React.FC<RelatedRapporterProps> = (props) => {
  const { className, docs, introContent, lang } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo="rapporter" showTags lang={lang}/>
        })}
      </div>
    </div>
  )
}
