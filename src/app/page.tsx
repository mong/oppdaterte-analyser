import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";

export default function Home() {
  return (
    <main>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="body1">Se side for <Link href="/kompendium">kompendium</Link></Typography>
        </Grid>
      </Grid>
    </main>
  );
}
