import React, { PropsWithChildren } from "react";
import { Container, Typography } from "@mui/material";
import { Box } from "@mui/material";

type HeaderMiddleProps = {
  title: string;
};

export function HeaderMiddle({
  title,
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
        maxWidth="xxl"
        disableGutters={false}
        sx={{ padding: 4, "@media print": { paddingY: 0 } }}
      >
        <Typography variant="h1">{title}</Typography>
        {children}
      </Container>
    </Box>
  );
}

export default HeaderMiddle;
