import Image from "next/image";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function Footer() {
  return (
    <Grid container spacing={2}>
      <Grid
        xs={12}
        sx={{ bgcolor: "footer1.main", color: "footer1.contrastText" }}
        className="footer-section"
      >
        <Typography variant="body1">Øverste del av bunnmeny</Typography>
      </Grid>
      <Grid
        xs={12}
        sx={{ bgcolor: "footer2.main", color: "footer2.contrastText" }}
        className="footer-section"
      >
        {/* TODO: Log should switch to larger size small screens.
            See how the skde.no footer logo has a larger size for small
            screens.
        */}
        <Image
          src="/logo-skde-neg.svg"
          alt="SKDE-logo"
          width={129}
          height={52}
          priority
        />
        <Typography variant="body1">Nederste del av bunnmeny</Typography>
      </Grid>
    </Grid>
  );
}
