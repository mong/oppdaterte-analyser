import { Suspense } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import ResultBoxList from "@/app/components/ResultBoxList";
import Header from "@/app/components/Header";
import CompendiumHeader from "@/app/components/CompendiumHeader";

export default async function Playground() {
  const compendiumSlug = "barn";
  const lang = "no";

  return (
    <>
      <Suspense fallback={<Header title="_" subtitle="_" />}>
        <CompendiumHeader slug={compendiumSlug} lang={lang} />
      </Suspense>
      <main>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography variant="h4">Lekeplass for å prøve ut kode</Typography>
            <Suspense fallback={<Typography>Henter kompendium ...</Typography>}>
              <ResultBoxList compendiumSlug={compendiumSlug} lang={lang} />
            </Suspense>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
