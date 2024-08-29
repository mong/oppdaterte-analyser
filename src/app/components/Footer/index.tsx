import Image from "next/image";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

export default function Footer() {
  return (
    <Grid container spacing={2}>
      <Grid
        xs={12}
        sx={{ bgcolor: "footer1.main", color: "footer1.contrastText" }}
      >
        <Typography variant="body1"></Typography>
      </Grid>
      <Grid
        className="centered"
        xs={12}
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
      </Grid>
    </Grid>
  );
}
