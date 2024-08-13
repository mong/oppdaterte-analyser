import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

export default function Home() {
  return (
    <main>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography>
            Benytt &ldquo;slug&rdquo; i URL for å se spesifikt kompendium, f.
            eks. <Link href="/barn">/barn</Link>.
          </Typography>
        </Grid>
      </Grid>
    </main>
  );
}
