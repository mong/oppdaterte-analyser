import { Suspense } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Skeleton } from "@mui/material";
import AnalysisBoxList from "@/app/components/AnalysisBoxList";
import Header from "@/app/components/Header";
import CompendiumHeader from "@/app/components/CompendiumHeader";

export default async function Playground() {
  const compendiumSlug = "barn";
  const lang = "no";

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
                <Skeleton variant="rectangular" width={210} height={118} />
              }
            >
              <AnalysisBoxList compendiumSlug={compendiumSlug} lang={lang} />
            </Suspense>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
