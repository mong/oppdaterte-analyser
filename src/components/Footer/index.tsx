import Image from "next/image";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box>
      <Box
        sx={{ bgcolor: "footer1.main", color: "footer1.contrastText" }}
        className="padding"
      ></Box>
      <Box
        className="centered padding"
        sx={{ bgcolor: "footer2.main", color: "footer2.contrastText" }}
      >
        {/* TODO: Make logo responsive, so that it is larger on small screens.
            See how the skde.no footer logo has a larger size for small screens.
        */}
        <Image
          src="/img/logo-skde-neg.svg"
          alt="SKDE-logo"
          width={129}
          height={52}
          priority
        />
      </Box>
    </Box>
  );
}
