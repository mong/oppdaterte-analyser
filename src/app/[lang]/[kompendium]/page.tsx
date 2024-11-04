import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import Header from "@/components/Header";
import AnalyseList from "@/components/AnalyseList";
import { Lang } from "@/types";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";

import { remark } from "remark";
import html from "remark-html";

import { getAnalyserByTag, getTag, getTags } from "@/services/mongo";

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

  const analyser = await getAnalyserByTag(params.kompendium);

  return (
    <>
      <Header
        lang={params.lang}
        title={tag.fullname[params.lang]}
        introduction={tag.introduction[params.lang]}
      ></Header>
      <main>
        <Suspense
          fallback={
            <Box className="centered" sx={{ paddingTop: 5 }}>
              <CircularProgress />
            </Box>
          }
        >
          <AnalyseList analyser={analyser} lang={params.lang} />
        </Suspense>
      </main>
    </>
  );
}
