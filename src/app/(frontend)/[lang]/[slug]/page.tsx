import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Container } from '@mui/material'
import { SelectionProvider } from '@/lib/SelectionContext'
import { notFound } from 'next/navigation'
import { Lang } from '@/types'

import { BreadCrumbStop } from '@/components/Header/SkdeBreadcrumbs'
import { getDictionary } from '@/lib/dictionaries'
import Header from '@/components/Header'

import { makeDateElem } from '@/lib/helpers'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export const dynamic = 'force-static';
export const revalidate = 60;


export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [];

  const payload = await getPayload({ config: configPromise })
  return (await Promise.all((["en", "no"] as Lang[]).map(async (lang) =>
    (await payload.find({
      collection: 'pages',
      draft: false,
      limit: 0,
      locale: lang,
      fallbackLocale: false,
      overrideAccess: false,
      pagination: false,
      where: {
        publiseringsStatus: { equals: "published" }
      },
      select: {
        slug: true,
      },
    })).docs.map(({ slug }) => ({ slug, lang }))
  ))).flat();
}

type Args = {
  params: Promise<{
    slug: string
    lang: Lang
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();

  const { slug = '', lang } = await paramsPromise;
  const page = await queryPageBySlug({ slug, lang });

  const payload = await getPayload({ config: configPromise });
  const otherLang = (await payload.find({
    collection: 'pages',
    depth: 1,
    limit: 1,
    where: {
      slug: { equals: slug },
      publiseringsStatus: { equals: "published" }
    },
    pagination: false,
    locale: lang === 'en' ? 'no' : 'en',
    overrideAccess: false,
    select: {},
  })).docs.length > 0;

  if (!page) return notFound();

  const dict = await getDictionary(lang);

  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.general.homepage,
    },
    {
      link: `/${lang}/${slug}`,
      text: page.title,
    },
  ];



  return (
    <>
      {draft && <LivePreviewListener />}
      <Header title={page.title} breadcrumbs={breadcrumbs} lang={otherLang ? lang : undefined}>
        <RichText
          data={page.description!}
          enableGutter={false}
          enableProse={false}
        />
      </Header>

      <Container maxWidth="xxl">
        <article className="w-full">
          <RenderBlocks blocks={page.layout} />
        </article>
      </Container>
    </>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', lang } = await paramsPromise
  const rapport = await queryPageBySlug({ slug, lang })
  const dict = await getDictionary(lang);

  return {
    title: `${rapport.title} - ${dict.general.health_atlas}`,
  };
}

const queryPageBySlug = cache(async ({ slug, lang }: { slug: string, lang: Lang }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale: lang,
    fallbackLocale: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
})
