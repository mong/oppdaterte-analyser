import { Suspense } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Skeleton } from "@mui/material";
import Header from "@/app/components/Header";
import AnalyseList from "@/app/components/AnalyseList";

import { getAnalyserByTag, getTag, getTags } from "@/app/services/mongo";

// The function can also fetch data for the compendium and get its
// metadata from there. For more, see:
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
//
// Also, the function should be moved to separate file, if possible?
export const generateMetadata = async ({
  params,
}: {
  params: { kompendium: string };
}) => {
  return {
    title: `${params.kompendium}`,
    description: `Oppdaterte analyser for ${params.kompendium}`,
    keywords: `${params.kompendium}`,
  };
};

export default async function KompendiumPage({
  params,
}: {
  params: { lang: string; kompendium: string };
}) {
  const tag = await getTag(params.kompendium);
  const analyser = await getAnalyserByTag(params.kompendium);

  const tags = await getTags(
    Array.from(new Set(analyser.flatMap((analyse) => analyse.tags))),
  );

  return (
    <>
      <Header
        title={tag.fullname[params.lang]}
        introduction={tag.introduction[params.lang]}
      ></Header>
      <main>
        <Suspense
          fallback={<Skeleton variant="rectangular" width={210} height={318} />}
        >
          <AnalyseList analyser={analyser} tags={tags} lang={params.lang} />
        </Suspense>
      </main>
    </>
  );
}
