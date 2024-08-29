import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

type HeaderMiddleProps = {
  title: string;
  introduction: string;
};

export const HeaderMiddle = ({ title, introduction }: HeaderMiddleProps) => {
  return (
    <Grid
      container
      spacing={2}
      rowSpacing={6}
      sx={{ bgcolor: "primary.light" }}
    >
      <Grid xs={12} className="centered">
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h6">{introduction}</Typography>
      </Grid>
    </Grid>
  );
};

export default HeaderMiddle;
