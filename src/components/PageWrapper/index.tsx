"use client";

import { PropsWithChildren } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const PageWrapper = ({ children }: PropsWithChildren) => {
  const theme = useTheme();

  const styles = {
    pageWrapper: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      "& .padding": {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
      "& .centered": {
        [theme.breakpoints.down("sm")]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4),
        },
        [theme.breakpoints.up("sm")]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4),
        },
        [theme.breakpoints.up("lg")]: {
          paddingLeft: theme.spacing(6),
          paddingRight: theme.spacing(6),
        },
        [theme.breakpoints.up("xl")]: {
          paddingLeft: theme.spacing(16),
          paddingRight: theme.spacing(16),
        },
      },
      "& .analyse-boxes": {
        [theme.breakpoints.down("md")]: {
          paddingLeft: theme.spacing(0),
          paddingRight: theme.spacing(0),
        },
      },
      backgroundColor: theme.palette.background.paper,
    },
  };

  return <Box sx={styles.pageWrapper}>{children}</Box>;
};

export default PageWrapper;
