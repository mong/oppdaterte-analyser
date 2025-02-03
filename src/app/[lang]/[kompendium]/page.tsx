import { Suspense } from "react";
import { Box, CircularProgress, Container } from "@mui/material";
import Header from "@/components/Header";
import AnalyseList from "@/components/AnalyseList";
import { Lang } from "@/types";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";

import { getAnalyserByTag, getTag } from "@/services/mongo";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import UnderDevelopment from "@/components/UnderDevelopment";

export const generateMetadata = async (props: {
  params: Promise<{ lang: Lang; kompendium: string }>;
}) => {
  const { kompendium, lang } = await props.params;
  const tag = await getTag(kompendium);
  const dict = await getDictionary(lang);

  return {
    title: `${tag.fullname[lang]} - ${dict.general.updated_analyses}`,
    description: `${dict.general.updated_analyses}: ${tag.fullname[lang]}`,
    keywords: `${kompendium}`,
  };
};

export default async function KompendiumPage(props: {
  params: Promise<{ lang: Lang; kompendium: string }>;
}) {
  const { kompendium, lang } = await props.params;
  const tag = await getTag(kompendium);
  if (!tag?.introduction || !["en", "no"].includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const analyser = await getAnalyserByTag(kompendium);

  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.breadcrumbs.homepage,
    },
    {
      link: "https://www.skde.no/helseatlas/",
      text: dict.breadcrumbs.health_atlas,
    },
    {
      link: `/${lang}/`,
      text: dict.breadcrumbs.updated_analyses,
    },
    {
      link: `/${lang}/${kompendium}/`,
      text: tag.fullname[lang],
    },
  ];

  return (
    <>
      <Header
        lang={lang}
        breadcrumbs={breadcrumbs}
        title={tag.fullname[lang]}
        introduction={tag.introduction[lang]}
      ></Header>
      <main>
        <UnderDevelopment lang={lang} />
        <Container
          maxWidth="xl"
          disableGutters={false}
          sx={{ paddingY: 4, paddingX: { xs: 0, md: 4 } }}
        >
          <Suspense
            fallback={
              <Box sx={{ paddingTop: 4 }}>
                <CircularProgress />
              </Box>
            }
          >
            <AnalyseList analyser={analyser} lang={lang} />
          </Suspense>
        </Container>
      </main>
    </>
  );
}
