import React, { PropsWithChildren } from "react";
import { Container, Typography } from "@mui/material";
import { Box } from "@mui/material";

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
    <Box
      sx={{
        bgcolor: "primary.light",
        paddingY: 4,
        "@media print": { paddingY: 0 },
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters={false}
        sx={{ padding: 4, "@media print": { paddingY: 0 } }}
      >
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h6">{introduction}</Typography>
        {children}
      </Container>
    </Box>
  );
}

export default HeaderMiddle;
