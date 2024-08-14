"use client";

import { PropsWithChildren } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

type PageWrapperProps = {};

export const PageWrapper = ({
  children,
}: PropsWithChildren<PageWrapperProps>) => {
  const theme = useTheme();

  const styles = {
    pageWrapper: {
      "& .MuiGrid2-container > .MuiGrid2-root": {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(8),
        [theme.breakpoints.down("sm")]: {
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
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
      backgroundColor: theme.palette.background.paper,
    },
  };

  return <Box sx={styles.pageWrapper}>{children}</Box>;
};

export default PageWrapper;