import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";

export default function CenteredContainer({
  children,
  analyseBox = false,
}: PropsWithChildren<{ analyseBox?: Boolean }>) {
  return (
    <Container maxWidth="xl" disableGutters={true}>
      <Box
        sx={{
          paddingY: 4,
          paddingX: analyseBox ? { xs: 0, md: 4 } : 4,
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
