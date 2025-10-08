import { Lang } from "@/types";
import { getPayload, PaginatedDocs } from "payload";
import { cache } from "react";
import config from "@payload-config";
import { Tag } from "@/payload-types";

export const getPayloadTag = cache(
  async ({ identifier, lang }: { identifier: string; lang: Lang }) => {
    const payload = await getPayload({ config: config });

    const result = await payload.find({
      collection: "tags",
      limit: 1,
      locale: lang,
      pagination: false,
      where: {
        identifier: {
          equals: identifier,
        },
      },
      fallbackLocale: false,
    });

    return result.docs?.[0] as Tag || null;
  },
);

export const getPayloadKompendier = cache(
  async ({ lang }: { lang: Lang }) => {
    const payload = await getPayload({ config: config });

    const result = await payload.find({
      collection: "tags",
      limit: Infinity,
      locale: lang,
      pagination: false,
      sort: "title",
      where: {
        isKompendium: { equals: true },
      },
    });

    return result.docs as Tag[];
  },
);

export const getTags = cache(
  async ({ tags, lang }: { tags: string[], lang: Lang }) => {
    const payload = await getPayload({ config: config });

    const result = await payload.find({
      collection: "tags",
      limit: Infinity,
      locale: lang,
      pagination: false,
      sort: "title",
      where: {
        identifier: { in: tags },
      },
    });

    return Object.fromEntries((result.docs as Tag[]).map((tag) => [tag.identifier, tag]));
  },
);
