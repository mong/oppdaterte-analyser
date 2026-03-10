import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Analyser } from '../../../payload-types'

export const revalidateAnalyse: CollectionAfterChangeHook<Analyser> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path_no = `/no/analyse/${doc.slug}`
      const path_en = `/en/analyse/${doc.slug}`
      payload.logger.info(`Revalidating analyse at path: ${path_no} and ${path_en}`)

      revalidatePath(path_no, "page")
      revalidatePath(path_en, "page")

      revalidateTag('analyser-sitemap')
    }

    // If the analyse was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath_no = `/no/analyse/${previousDoc.slug}`
      const oldPath_en = `/en/analyse/${previousDoc.slug}`

      payload.logger.info(`Revalidating old analyse at path: ${oldPath_no} and ${oldPath_en}`)

      revalidatePath(oldPath_no, "page")
      revalidatePath(oldPath_en, "page")
      revalidateTag('analyser-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Analyser> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path_no = `/no/analyse/${doc?.slug}`
    const path_en = `/en/analyse/${doc?.slug}`

    revalidatePath(path_no, "page")
    revalidatePath(path_en, "page")
    revalidateTag('analyser-sitemap')
  }

  return doc
}
