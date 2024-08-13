import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

export const HeaderMiddle = () => {
  return (
    <Grid
      container
      spacing={2}
      rowSpacing={6}
      sx={{ bgcolor: "primary.light" }}
    >
      <Grid xs={12}>
        <Typography variant="h1">Sidetittel</Typography>
        <br />
        <Typography variant="h6">Undertittel</Typography>
      </Grid>
    </Grid>
  );
};

export default HeaderMiddle;
