import Box from "@mui/material/Box/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";

export default function Home() {
  return (
    <main>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="h2">Oversiktsside</Typography>
          <Box>
            Se side for <Link href="/kompendium">kompendium</Link>.
          </Box>
        </Grid>
      </Grid>
    </main>
  );
}
