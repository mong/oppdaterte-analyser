import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/material";
import CenteredContainer from "../CenteredContainer";

type HeaderMiddleProps = {
  title: string;
  introduction: string;
};

export const HeaderMiddle = ({ title, introduction }: HeaderMiddleProps) => {
  return (
    <Box sx={{ bgcolor: "primary.light", paddingY: 4 }}>
      <CenteredContainer>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h6">{introduction}</Typography>
      </CenteredContainer>
    </Box>
  );
};

export default HeaderMiddle;
