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
      const en_path = `/en/rapporter/${doc.slug}`
      const no_path = `/no/rapporter/${doc.slug}`
      payload.logger.info(`Revalidating rapport at path: ${en_path} and ${no_path}`)

      revalidatePath(en_path)
      revalidatePath(no_path)

      revalidateTag('rapporter-sitemap')
    }

    // If the rapport was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const en_oldPath = `/en/rapporter/${previousDoc.slug}`
      const no_oldPath = `/no/rapporter/${previousDoc.slug}`

      payload.logger.info(`Revalidating old rapport at path: ${en_oldPath} and ${no_oldPath}`)

      revalidatePath(en_oldPath)
      revalidatePath(no_oldPath)
      revalidateTag('rapporter-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Rapporter> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const no_path = `/no/rapporter/${doc?.slug}`
    const en_path = `/en/rapporter/${doc?.slug}`

    revalidatePath(en_path)
    revalidatePath(no_path)
    revalidateTag('rapporter-sitemap')
  }

  return doc
}
