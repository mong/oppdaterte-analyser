import { Suspense } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Skeleton } from "@mui/material";
import Header from "@/app/components/Header";
import AnalyseList from "@/app/components/AnalyseList";

import { Analyse } from "@/app/models/AnalyseModel";
import { toPlainObject } from "@/app/lib/mappings";

import {
  getCompendiumBySlug,
  getAnalyseByName,
  getAnalyserByTag,
} from "@/app/services/mongo";

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
  const kompendium = await getCompendiumBySlug(params.kompendium);

  const analyser: Analyse[] = toPlainObject(
    await getAnalyserByTag(params.kompendium),
  );

  return (
    <>
      <Suspense fallback={<Header title="&nbsp;" subtitle="&nbsp;" />}>
        <Header
          title={kompendium.title.get(params.lang)}
          subtitle={kompendium.subtitle.get(params.lang)}
        ></Header>
      </Suspense>
      <main>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Suspense
              fallback={
                <Skeleton variant="rectangular" width={210} height={318} />
              }
            >
              <AnalyseList analyser={analyser} lang={params.lang} />
            </Suspense>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
