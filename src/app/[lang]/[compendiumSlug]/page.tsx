import { Suspense } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Header from "@/app/components/Header";
import CompendiumHeader from "@/app/components/CompendiumHeader";

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

export default function Compendium({
  params,
}: {
  params: { compendiumSlug: string };
}) {
  const compendiumSlug = params.compendiumSlug;
  const lang = "no";

  return (
    <>
      <Suspense fallback={<Header title="_" subtitle="_" />}>
        <CompendiumHeader slug={compendiumSlug} lang={lang} />
      </Suspense>
      <main>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography variant="body1">
              Kompendium: {params.compendiumSlug}
            </Typography>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
