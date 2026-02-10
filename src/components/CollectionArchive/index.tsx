import React from 'react'

import { Card } from '@/components/Card'
import { Lang } from '@/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type Props = {
  lang: Lang
}

export const CollectionArchive: React.FC<Props> = async (props) => {
  const { lang } = props

  const payload = await getPayload({ config: configPromise });

  const rapporter = await payload.find({
    collection: 'rapporter',
    depth: 1,
    limit: 0,
    where: {
      publiseringsStatus: { equals: "published" }
    },
    pagination: false,
    locale: lang,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      tags: true,
      bilde: true,
    },
  });

  return (
    <div className="my-8">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-10">
        {rapporter.docs?.map((result, index) => {
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
