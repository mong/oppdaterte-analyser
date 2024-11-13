import Image from "next/image";
import { Box } from "@mui/material";
import CenteredContainer from "../CenteredContainer";

export default function Footer() {
  return (
    <Box component="footer" style={{ marginTop: "auto" }}>
      <Box
        sx={{
          bgcolor: "footer1.main",
          color: "footer1.contrastText",
          padding: 4,
        }}
      ></Box>
      <Box sx={{ bgcolor: "footer2.main", color: "footer2.contrastText" }}>
        {/* TODO: Make logo responsive, so that it is larger on small screens.
            See how the skde.no footer logo has a larger size for small screens.
        */}
        <CenteredContainer shrink={false}>
          <Image
            src="/img/logo-skde-neg.svg"
            alt="SKDE-logo"
            width={129}
            height={52}
            priority
          />
        </CenteredContainer>
      </Box>
    </Box>
  );
}
