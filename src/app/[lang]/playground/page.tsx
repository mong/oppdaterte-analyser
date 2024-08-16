import { Suspense } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import ResultBoxList from "@/app/components/ResultBoxList";
import Header from "@/app/components/Header";
import CompendiumHeader from "@/app/components/CompendiumHeader";
import CompendiumDates from "@/app/components/CompendiumDates";
import { Typography, Stack, Paper } from "@mui/material";

export default async function Playground() {
  const compendiumSlug = "barn";
  const lang = "no";

  return (
    <>
      <Suspense fallback={<Header title="&nbsp;" subtitle="&nbsp;" />}>
        <CompendiumHeader slug={compendiumSlug} lang={lang} />
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
            >
              <CompendiumDates slug={compendiumSlug} lang={lang} />
            </Suspense>
          </Grid>
          <Grid xs={12}>
            <Suspense>
              <ResultBoxList slug={compendiumSlug} lang={lang} />
            </Suspense>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
