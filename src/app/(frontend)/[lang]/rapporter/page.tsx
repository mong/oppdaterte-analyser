import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'

import React, { Suspense } from 'react'
import { Container, Typography, Link } from '@mui/material'
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

  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.general.homepage,
    },
    {
      link: `/${lang}`,
      text: dict.general.health_atlas,
    },
    {
      link: `/${lang}/rapporter`,
      text: dict.general.reports,
    },
  ];

  return (
    <>
      <Header
        lang={lang}
        title={dict.general.reports}
        breadcrumbs={breadcrumbs}
      >
        <Typography variant="h6" className="m-8">
          {
            {
              no: "Her finner du helseatlas i form av digitale rapporter som omhandler et utvalgt tema, fagområde eller en pasientgruppe. Rapportene gir et overordnet bilde av geografisk variasjon i tjenestebruk for en begrenset tidsperiode. Oppdaterte helseatlas finner du ",
              en: "Here you will find Health Atlases in the form of digital reports that cover a selected topic, field, or patient group. The reports provide an overview of geographical variation in the use of healthcare services for a defined period. Updated Health Atlases can be found ",
            }[lang]
          }
          <Link
            href={`https://analyser.skde.no/${lang === "en" ? "en/" : ""}`}
          >
            {{ no: "her", en: "here" }[lang]}
          </Link>
          .
        </Typography>
      </Header>
      <Container maxWidth="xxl">
        <Suspense>
          <CollectionArchive lang={lang} />
        </Suspense>
      </Container>
    </>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { lang } = await paramsPromise;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.general.reports} - ${dict.general.health_atlas}`,
  };
}
