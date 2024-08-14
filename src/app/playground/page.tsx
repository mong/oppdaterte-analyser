import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ResultBoxList from "../components/ResultBoxList";

export default function Playground() {
  return (
    <main>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="body1">Lekeplass for å prøve ut kode</Typography>
          <ResultBoxList />
        </Grid>
      </Grid>
    </main>
  );
}
