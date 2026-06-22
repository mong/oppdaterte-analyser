import { Lang } from "@/types";
import { getDictionary } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import { getAnalyser, getKompendier } from "@/services/payload";
import Link from "next/link";
import {
  Header,
  Breadcrumbs,
  HeroBanner,
  PageLayout,
  PageContent,
  SubjectAreaCard,
} from "@mong/material-ui";


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
  const analyser = await getAnalyser({ lang });

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
              {/* {["Barn", "Diabetes", "Dagkirurgi", "Gynekologi", "Hjerte- og karsykdommer", "Kreft", "Psykisk helse"].map((title, i) => (
                <SubjectAreaCard
                  leftLabelText={`${i} rapporter`}
                  rightLabelText={`${i} analyser`}
                  title={title}
                />
              ))} */}
              {kompendier.map((komp, i) => (
                <Link href={`/${lang}/fag/${komp.identifier}`} className="no-underline">
                  <SubjectAreaCard
                    leftLabelText="3 rapporter"
                    rightLabelText={`${analyser
                      .map((analyse) => analyse.tags || [])
                      .filter((tags) =>
                        tags.some((tag) =>
                          typeof tag !== "object"
                            ? false
                            : tag.identifier === komp.identifier,
                        ),
                      ).length} analyser`}
                    title={komp.title}
                  />
                </Link>
              ))}
            </div>
          </main>
        </PageContent>
      </PageLayout>
    </>
  );
}
