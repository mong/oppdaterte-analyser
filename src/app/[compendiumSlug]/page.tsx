import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

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
  return (
    <main>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="body1">
            Kompendium: {params.compendiumSlug}
          </Typography>
        </Grid>
      </Grid>
    </main>
  );
}
