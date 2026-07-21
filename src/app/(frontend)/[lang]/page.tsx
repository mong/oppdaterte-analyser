import { Lang } from "@/types";
import { getDictionary } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import { getKompendier } from "@/services/payload";
import Link from "next/link";
import {
  Header,
  Breadcrumbs,
  HeroBanner,
  PageLayout,
  PageContent,
  SubjectAreaCard,
} from "@mong/material-ui";
import { Analyser, Rapporter, Tag } from "@/payload-types";
import { MaxWidth } from "@/components/MaxWidth"
import { isNewRapport } from "@/lib/helpers";

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
    title: dict.general.health_atlas,
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
  const kompendier = Object.groupBy(
    (await getKompendier({ lang }))
      .toSorted((a, b) => a.title.localeCompare(b.title, lang)),
    ({ taggedRapporter }) => (taggedRapporter?.docs as Rapporter[])?.filter(d => d.publiseringsStatus === "published").some(
      isNewRapport) ? "new" : "old"
  )


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
      <Breadcrumbs explicitTrail={breadcrumbs} />

      <PageLayout>
        <HeroBanner
          description={dict.frontpage.introduction}
          image="/background.jpeg"
          title={dict.general.health_atlas}
        />
        <PageContent>
          <MaxWidth size="large">
            <h2 className="my-8">{dict.frontpage.fagområder}</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 auto-rows-[100px] md:auto-rows-[150px]">
              {(kompendier.new || [])
                .map(komp => ({ ...komp, new: true }) as Tag & { new?: boolean })
                .concat(kompendier.old || []).map((komp) => {
                  const n_analyser = komp.taggedAnalyser?.docs?.filter((d => (d as Analyser).publiseringsStatus === "published")).length || 0;
                  const n_rapporter = komp.taggedRapporter?.docs?.filter((d => (d as Rapporter).publiseringsStatus === "published")).length || 0;

                  return (
                    <Link href={`/${lang}/fag/${komp.identifier}`} className="no-underline" key={komp.identifier}>
                      <SubjectAreaCard
                        isNew={komp.new === true}
                        leftLabelText={n_rapporter && `${n_rapporter} ${n_rapporter === 1 ? dict.general.rapport : dict.general.rapporter}`.toLowerCase() || undefined}
                        rightLabelText={n_analyser && `${n_analyser} ${n_analyser === 1 ? dict.general.analyse : dict.general.analyser}`.toLowerCase() || undefined}
                        title={komp.title}
                      />
                    </Link>
                  );
                }
                )}
            </div>
          </MaxWidth>
        </PageContent>
      </PageLayout>
    </>
  );
}
