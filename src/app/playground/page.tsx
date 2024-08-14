import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ResultBoxList from "@/app/components/ResultBoxList";
import { Suspense } from "react";

export default async function Playground() {
  return (
    <main>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="h4">Lekeplass for å prøve ut kode</Typography>
          <Suspense
            fallback={
              <Typography variant="body1">Laster inn kompendium</Typography>
            }
          >
            <ResultBoxList compendiumSlug="barn" />
          </Suspense>
        </Grid>
      </Grid>
    </main>
  );
}
