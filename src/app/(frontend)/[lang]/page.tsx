import { Lang } from "@/types";
import { getDictionary } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import { getAnalyser, getKompendier, getRapporter } from "@/services/payload";
import Link from "next/link";
import {
  Header,
  Breadcrumbs,
  HeroBanner,
  PageLayout,
  PageContent,
  SubjectAreaCard,
} from "@mong/material-ui";
import { Analyser, Rapporter } from "@/payload-types";


export const dynamic = 'force-static';
export const revalidate = 60;

export const dynamicParams = false;
export async function generateStaticParams() {
  return [{ lang: "no" }, { lang: "en" }] as { lang: Lang }[];
}

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return {
    title: dict.frontpage.title,
    description: dict.frontpage.introduction,
    keywords: dict.general.metadata_keywords,
  };
}

export type MainPageProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

export default async function MainPage(props: MainPageProps) {
  const params = await props.params;
  const { lang } = params;

  if (!["en", "no"].includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  const kompendier = await getKompendier({ lang });
  const analyser = await getAnalyser({ lang, select: { tags: true } });
  const rapporter = await getRapporter({ lang, select: { tags: true } });


  function countTags(analyserOrRapporter: (Analyser | Rapporter)[], identifier: string) {
    return analyserOrRapporter.map((item) => item.tags)
      .filter((tags) =>
        tags!.some((tag) =>
          typeof tag !== "object"
            ? false
            : tag.identifier === identifier,
        ),
      ).length;
  }

  console.log(rapporter, analyser);

  const breadcrumbs = [{
    href: `/${lang}`,
    name: dict.general.health_atlas,
  }];

  return (
    <>
      <Header
        lang={lang}
        langChoices={[
          { code: 'no', url: '/no' },
          { code: 'en', url: '/en' },
        ]}
      />
      <Breadcrumbs
        explicitTrail={breadcrumbs}
      />

      <PageLayout>

        <HeroBanner
          description={dict.frontpage.introduction}
          image="/hero-bg-3.jpg"
          title={dict.general.health_atlas}
        />
        <PageContent>

          <main>
            <h2>{dict.frontpage.fagområder}</h2>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4">
              {kompendier.map((komp, i) => {
                const n_analyser = countTags(analyser, komp.identifier);
                const n_rapporter = countTags(rapporter, komp.identifier);

                return (
                  <Link href={`/${lang}/fag/${komp.identifier}`} className="no-underline" key={komp.identifier}>
                    <SubjectAreaCard
                      isNew={i===0}
                      leftLabelText={`${n_rapporter} ${n_rapporter === 1 ? dict.general.rapport : dict.general.rapporter}`.toLowerCase()}
                      rightLabelText={`${n_analyser} ${n_analyser === 1 ? dict.general.analyse : dict.general.analyser}`.toLowerCase()}
                      title={komp.title}
                    />
                  </Link>
                );
              }
              )}
            </div>
          </main>
        </PageContent>
      </PageLayout>
    </>
  );
}
