import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function Compendium({ params }: { params: { slug: string } }) {
  return (
    <main>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="body1">Kompendium: {params.slug}</Typography>
        </Grid>
      </Grid>
    </main>
  );
}
