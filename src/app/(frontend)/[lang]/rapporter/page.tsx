import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Container, Typography } from '@mui/material'
import { Lang } from '@/types'
import { BreadCrumbStop } from '@/components/Header/SkdeBreadcrumbs'
import { getDictionary } from '@/lib/dictionaries'
import Header from '@/components/Header'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    lang: Lang;
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { lang } = await paramsPromise;
  const dict = await getDictionary(lang);
  const payload = await getPayload({ config: configPromise });

  const rapporter = await payload.find({
    collection: 'rapporter',
    depth: 1,
    limit: 0,
    where: {
      test: { equals: false }
    },
    pagination: false,
    locale: lang,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      tags: true,
      meta: true,
      bilde: true,
    },
  });


  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.breadcrumbs.homepage,
    },
    {
      link: `/${lang}`,
      text: dict.breadcrumbs.health_atlas,
    },
    {
      link: `/${lang}/rapporter`,
      text: dict.breadcrumbs.reports,
    },
  ];

  return (
    <>
      <Header
        lang={lang}
        title={dict.breadcrumbs.reports}
        breadcrumbs={breadcrumbs}
      >
        <Typography variant="h6" className="m-8">
          Her finner du helseatlas i form av digitale rapporter som omhandler et utvalgt tema, fagområde eller en pasientgruppe. Rapportene gir et overordnet bilde av geografisk variasjon i tjenestebruk for en begrenset tidsperiode.
        </Typography>
      </Header>
      <Container maxWidth="xl">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{dict.breadcrumbs.reports}</h1>
        </div>
        <CollectionArchive rapporter={rapporter.docs} lang={lang} />
      </Container>
    </>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { lang } = await paramsPromise;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.breadcrumbs.reports} - ${dict.general.health_atlas}`,
  };
}
