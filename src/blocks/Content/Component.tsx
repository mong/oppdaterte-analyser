import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'


export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '6',
    half: '3',
    oneThird: '2',
    twoThirds: '4',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-6 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { richText, size } = col

            return (
              <div
                className={cn(`col-span-4 md:col-span-${colsSpanClasses[size!]}`, {
                  'sm:col-span-3': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
