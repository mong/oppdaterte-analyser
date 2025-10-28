import { Lang } from "@/types";
import { getPayload, PaginatedDocs } from "payload";
import { cache } from "react";
import config from "@payload-config";
import { Analyser, Tag } from "@/payload-types";
import { draftMode } from "next/headers";

export const getTag = cache(
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

    return (result.docs?.[0] as Tag) || null;
  },
);

export const getKompendier = cache(async ({ lang }: { lang: Lang }) => {
  const payload = await getPayload({ config: config });

  const result = await payload.find({
    collection: "tags",
    limit: 0,
    locale: lang,
    pagination: false,
    sort: "title",
    where: {
      isKompendium: { equals: true },
    },
  });

  return result.docs as Tag[];
});

export const getTags = cache(
  async ({ tags, lang }: { tags: string[]; lang: Lang }) => {
    const payload = await getPayload({ config: config });

    const result = await payload.find({
      collection: "tags",
      limit: 0,
      locale: lang,
      pagination: false,
      sort: "title",
      where: {
        identifier: { in: tags },
      },
    });

    return Object.fromEntries(
      (result.docs as Tag[]).map((tag) => [tag.identifier, tag]),
    );
  },
);

export const getAnalyser = cache(async ({ lang }: { lang: Lang }) => {

  const payload = await getPayload({ config: config });

  const result = await payload.find({
    collection: "analyser",
    limit: 0,
    locale: lang,
    pagination: false,
    fallbackLocale: false,
    sort: "title",
    where: {
      publiseringsStatus: { equals: "published" },
    },
  });

  return result.docs as Analyser[];
});

export const getAnalyserByTag = cache(
  async ({ identifier, lang }: { identifier: string; lang: Lang }) => {

    const payload = await getPayload({ config: config });

    const tag = await getTag({ identifier, lang });

    const result = await payload.find({
      collection: "analyser",
      limit: 0,
      locale: lang,
      pagination: false,
      fallbackLocale: false,
      sort: "title",
      depth: 0,
      where: {
        tags: { contains: tag.id },
        publiseringsStatus: { equals: "published" },
      },
    });

    return result.docs as Analyser[];
  },
);
