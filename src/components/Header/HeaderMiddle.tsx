import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/material";

type HeaderMiddleProps = {
  title: string;
  introduction: string;
};

export const HeaderMiddle = ({ title, introduction }: HeaderMiddleProps) => {
  return (
    <Box sx={{ bgcolor: "primary.light" }} className="padding">
      <Box className="centered padding">
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h6">{introduction}</Typography>
      </Box>
    </Box>
  );
};

export default HeaderMiddle;
