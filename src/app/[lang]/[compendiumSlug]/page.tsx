import { Suspense } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Stack, Paper } from "@mui/material";
import Header from "@/app/components/Header";
import CompendiumHeader from "@/app/components/CompendiumHeader";
import AnalysisBoxList from "@/app/components/AnalysisBoxList";

// The function can also fetch data for the compendium and get its
// metadata from there. For more, see:
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
//
// Also, the function should be moved to separate file, if possible?
export const generateMetadata = async ({
  params,
}: {
  params: { compendiumSlug: string };
}) => {
  return {
    title: `${params.compendiumSlug}`,
    description: `Oppdaterte analyser for ${params.compendiumSlug}`,
    keywords: `${params.compendiumSlug}`,
  };
};

export default function CompendiumPage({
  params,
}: {
  params: { lang: string; compendiumSlug: string };
}) {
  const compendiumSlug = params.compendiumSlug;
  const lang = params.lang;

  return (
    <>
      <Suspense fallback={<Header title="&nbsp;" subtitle="&nbsp;" />}>
        <CompendiumHeader compendiumSlug={compendiumSlug} lang={lang} />
      </Suspense>
      <main>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Suspense
              fallback={
                <Stack direction="row" spacing={2}>
                  <Paper>Opprettet: __.__.____, __:__:__</Paper>
                  <Paper>Oppdatert: __.__.____, __:__:__</Paper>
                </Stack>
              }
            ></Suspense>
          </Grid>
          <Grid xs={12}>
            <Suspense>
              <AnalysisBoxList slug={compendiumSlug} lang={lang} />
            </Suspense>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
