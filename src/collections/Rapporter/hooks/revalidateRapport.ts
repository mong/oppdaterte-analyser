import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Rapporter } from '../../../payload-types'

export const revalidateRapport: CollectionAfterChangeHook<Rapporter> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/[lang]/rapporter/${doc.slug}`
      payload.logger.info(`Revalidating rapport at path: ${path}`)

      revalidatePath(path)
      revalidateTag('rapporter-sitemap')
    }

    // If the rapport was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/[lang]/rapporter/${previousDoc.slug}`

      payload.logger.info(`Revalidating old rapport at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('rapporter-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Rapporter> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/[lang]/rapporter/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('rapporter-sitemap')
  }

  return doc
}
