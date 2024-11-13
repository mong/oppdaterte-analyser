import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";

export default function CenteredContainer({
  children,
  analyseBox = false,
  shrink = true,
}: PropsWithChildren<{ analyseBox?: Boolean; shrink?: Boolean }>) {
  return (
    <Container maxWidth="xl" disableGutters={true}>
      <Box
        sx={{
          paddingY: 4,
          paddingX: analyseBox
            ? { xs: 0, md: 4 }
            : { xs: shrink ? 2 : 4, sm: 4 },
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
