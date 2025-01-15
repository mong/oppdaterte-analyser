import React, { PropsWithChildren } from "react";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/material";
import CenteredContainer from "../CenteredContainer";

type HeaderMiddleProps = {
  title: string;
  introduction: string;
};

export function HeaderMiddle({
  title,
  introduction,
  children,
}: PropsWithChildren<HeaderMiddleProps>) {
  return (
    <Box sx={{ bgcolor: "primary.light", paddingY: 4 }}>
      <CenteredContainer>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h6">{introduction}</Typography>
        {children}
      </CenteredContainer>
    </Box>
  );
}

export default HeaderMiddle;
