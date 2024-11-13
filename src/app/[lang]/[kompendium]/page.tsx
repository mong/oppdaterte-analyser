import { Suspense } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import Header from "@/components/Header";
import AnalyseList from "@/components/AnalyseList";
import { Lang } from "@/types";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";

import { getAnalyserByTag, getTag } from "@/services/mongo";
import CenteredContainer from "@/components/CenteredContainer";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";

// The function can also fetch data for the compendium and get its
// metadata from there. For more, see:
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
//
// Also, the function should be moved to separate file, if possible?
export const generateMetadata = async ({
  params,
}: {
  params: { lang: Lang; kompendium: string };
}) => {
  const tag = await getTag(params.kompendium);
  const dict = await getDictionary(params.lang);

  return {
    title: `${tag.fullname[params.lang]}`,
    description: `${dict.general.updated_analyses}: ${tag.fullname[params.lang]}`,
    keywords: `${params.kompendium}`,
  };
};

/*

  The code below works to generate static pages locally, but is disabled because
  the build on github fails (it cannot connect to the MongoDB server)

export const dynamicParams = false;
export async function generateStaticParams() {
  const kompendier = await getKompendier();

  return ["no", "en"].flatMap((lang) =>
    kompendier.map((kompendium) => ({
      lang: lang,
      kompendium: kompendium.name,
    })),
  );
}
*/

export default async function KompendiumPage({
  params,
}: {
  params: { lang: Lang; kompendium: string };
}) {
  const tag = await getTag(params.kompendium);
  if (!tag?.introduction || !["en", "no"].includes(params.lang)) {
    notFound();
  }

  const dict = await getDictionary(params.lang);
  const analyser = await getAnalyserByTag(params.kompendium);

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
      link: "https://www.skde.no/helseatlas/",
      text: tag.fullname[params.lang],
    },
  ];

  return (
    <>
      <Header
        lang={params.lang}
        breadcrumbs={breadcrumbs}
        title={tag.fullname[params.lang]}
        introduction={tag.introduction[params.lang]}
      ></Header>
      <main>
        <CenteredContainer>
          <Alert severity="info" sx={{ marginBottom: -4 }}>
            {dict.general.under_development}{" "}
            <a href="mailto:helseatlas@skde.no?subject=Tilbakemelding på sidene for oppdaterte analyser">
              helseatlas@skde.no
            </a>
            .
          </Alert>
        </CenteredContainer>
        <CenteredContainer analyseBox={true}>
          <Suspense
            fallback={
              <Box sx={{ paddingTop: 4 }}>
                <CircularProgress />
              </Box>
            }
          >
            <AnalyseList analyser={analyser} lang={params.lang} />
          </Suspense>
        </CenteredContainer>
      </main>
    </>
  );
}
