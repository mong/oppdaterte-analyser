
import { Lang } from "@/types";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";

import { formatDate, getSubHeader } from "@/lib/helpers";
import RichText from "@/components/RichText";

import {
  Header,
  Breadcrumbs,
  PageLayout,
  PageContent,
  AnalysisCard,
} from "@mong/material-ui";

import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";

import { getAnalyserByTag, getTag, getRapporterByTag } from "@/services/payload";
import React from "react";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const dynamic = 'force-static';
export const revalidate = 60;

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [];

  const payload = await getPayload({ config: configPromise })
  const result = (await Promise.all((["en", "no"] as Lang[]).map(async (lang) =>
    (await payload.find({
      collection: 'tags',
      draft: false,
      limit: 0,
      locale: lang,
      fallbackLocale: false,
      overrideAccess: false,
      pagination: false,
      select: {
        identifier: true,
      },
    })).docs.map(({ identifier }) => ({ kompendium: identifier, lang }))
  ))).flat();
  return result;
}


export const generateMetadata = async (props: {
  params: Promise<{ lang: Lang; kompendium: string }>;
}) => {
  const { kompendium, lang } = await props.params;
  const tag = await getTag({ identifier: kompendium, lang });

  if (!tag || !["en", "no"].includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return {
    title: `${tag.title} - ${dict.general.updated_health_atlas}`,
    description: tag.description
      ? convertLexicalToPlaintext({ data: tag.description })
      : `${dict.general.updated_health_atlas}: ${tag.title}`,
    keywords: `${tag.title}, ${dict.general.metadata_keywords}`,
  };
};

export default async function KompendiumPage(props: {
  params: Promise<{ lang: Lang; kompendium: string }>;
}) {
  const { kompendium, lang } = await props.params;

  const tag = await getTag({ identifier: kompendium, lang });

  if (!tag || !["en", "no"].includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  const analyser = await getAnalyserByTag({
    identifier: kompendium,
    lang,
  });
  const rapporter = await getRapporterByTag({
    identifier: kompendium,
    lang,
    select: {
      title: true,
      publishedAt: true,
      createdAt: true,
      slug: true,
      tags: true,
      bilde: true,
      author: true,
    },
  });

  const breadcrumbs = [
    {
      href: `/${lang}`,
      name: dict.general.health_atlas,
    },
    {
      href: `/${lang}/fag/${kompendium}`,
      name: tag.title,
    },
  ];

  return (
    <>
      <Header
        lang={lang}
        langChoices={[
          { code: 'no', url: `/no/fag/${tag.identifier}` },
          { code: 'en', url: `/en/fag/${tag.identifier}` },
        ]}
      />
      <Breadcrumbs
        pathname={"/"}
        leading={breadcrumbs}
      />
      <PageLayout>
        <div className="bg-neutral-0 [&>*]:bg-transparent">
          <PageContent>
            <div className="flex justify-center text-center">
              <div className="max-w-[565px]">
                <h1>{tag.title}</h1>
                <div className="prose max-w-none prose-li:marker:text-black prose-li:my-0">
                  <RichText data={tag.description!} enableGutter={true} />
                </div>
              </div>
            </div>
          </PageContent>
        </div>
        <PageContent>
          <h2 className="py-8">{dict.general.analyser}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {analyser.map(async (analyse, i) => (
              <AnalysisCard
                key={i}
                author={analyse.author}
                buttonLabel="Les analyse"
                description="I 2026 ble det utført 8 500 synapseoverføringer for å svare på spørsmålet om hva som skal stå her - en økning fra 0 i 2025."
                targetGroup={getSubHeader(analyse.data, lang)}
                targetUrl={`/${lang}/analyse/${analyse.slug}`}
                title={analyse.title}
                updated={formatDate(analyse.publishedAt || analyse.createdAt, lang)}
              />))}
          </div>
        </PageContent>
        {rapporter.length > 0 && (
          <div className="bg-neutral-0 [&>*]:bg-transparent">
            <PageContent>
              <h2 className="py-8">{dict.general.rapporter}</h2>
              <div className="flex flex-col gap-8">
                {rapporter.map((rapport, i) => (
                  <AnalysisCard
                    key={i}
                    author={rapport.author}
                    buttonLabel="Les rapport"
                    description="I 2025 ble det utført 5 200 mandeloperasjoner – en økning fra 10 til 40 prosent siden 2015, med tydelige geografiske forskjeller."
                    imageUrl={typeof rapport.bilde === "object" && rapport.bilde?.sizes?.small?.url || ""}
                    isNew={false}
                    targetGroup="Hva skal stå her?"
                    targetUrl={`/${lang}/rapporter/${rapport.slug}`}
                    title={rapport.title}
                    updated={formatDate(rapport.publishedAt || rapport.createdAt, lang)}
                  />
                ))}
              </div>
            </PageContent>
          </div>
        )}
      </PageLayout >
    </>
  );
}
