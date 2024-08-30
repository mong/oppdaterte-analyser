import { Suspense } from "react";
import { Skeleton } from "@mui/material";
import Header from "@/components/Header";
import AnalyseList from "@/components/AnalyseList";

import { getAnalyserByTag, getTag, getTags } from "@/services/mongo";

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
  params: { lang: "en" | "no"; kompendium: string };
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
