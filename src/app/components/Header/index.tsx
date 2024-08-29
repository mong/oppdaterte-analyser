import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderMiddle from "./HeaderMiddle";
import Grid from "@mui/material/Grid";

type HeaderProps = {
  title: string;
  subtitle: string;
};

export const Header = ({ title, introduction }: HeaderProps) => {
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <HeaderTop />
        <HeaderMiddle title={title} introduction={introduction} />
      </Grid>
    </Grid>
  );
};

export { HeaderTop } from "./HeaderTop";
export { HeaderMiddle } from "./HeaderMiddle";
export default Header;
