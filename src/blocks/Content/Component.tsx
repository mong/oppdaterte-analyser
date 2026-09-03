import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'


export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: 'md:col-span-6',
    half: 'md:col-span-3',
    oneThird: 'md:col-span-2',
    twoThirds: 'md:col-span-4',
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
                className={`col-span-6 ${colsSpanClasses[size!]}`}
                key={index}
              >
                {richText &&
                  <div className="prose max-w-none prose-li:marker:text-black prose-li:my-0">
                    <RichText data={richText} enableGutter={false} />
                  </div>
                }
              </div>
            )
          })}
      </div>
    </div>
  )
}
