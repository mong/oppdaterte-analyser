import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'
import { Lang } from '@/types'

export type Props = {
  rapporter: CardPostData[]
  lang: Lang
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { rapporter, lang } = props

  return (
    <div className="my-8">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-10">
        {rapporter?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className="col-span-4" key={index}>
                <Card className="h-full" doc={result} relationTo="rapporter" showTags lang={lang} />
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
