import Image from "next/image";
import Grid from "@mui/material/Unstable_Grid2";

export const HeaderTop = () => {
  return (
    <Grid container spacing={2} sx={{ bgcolor: "background.paper" }}>
      <Grid xs={12} className="centered">
        <Image
          src="/img/skde-blue.png"
          alt="SKDE-logo"
          width={100}
          height={40}
          priority
        />
      </Grid>
    </Grid>
  );
};

export default HeaderTop;
