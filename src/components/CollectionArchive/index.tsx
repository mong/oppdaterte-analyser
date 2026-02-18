import React from 'react'
import { Lang } from '@/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cn } from '@/utilities/ui'
import { Media } from '../Media'

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
        {rapporter.docs?.filter(doc => typeof doc === 'object' && doc !== null).map((doc, index) => {
          const href = `/${lang}/rapporter/${doc.slug}`;
          return (
            <div className="col-span-4" key={index}>
              <a href={href} className="no-underline hover:underline text-inherit">
                <article
                  className={cn(
                    'rounded-[1.5rem] overflow-hidden hover:cursor-pointer',
                    'hover:shadow-lg transition-shadow duration-100 bg-[#e3f3ef] hover:[&_picture]:opacity-[0.8]',
                    'h-full',
                  )}
                >
                  <div className="max-h-[350px] overflow-hidden">
                    {!doc.bilde && <div className="">No image</div>}
                    {doc.bilde && typeof doc.bilde !== 'string' && <Media resource={doc.bilde} size="33vw" />}
                  </div>
                  <div className="p-4">
                    {doc.title && <h3>{doc.title}</h3>}
                  </div>
                </article>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
