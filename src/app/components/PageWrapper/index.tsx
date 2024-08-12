"use client";
import { styled, Box } from "@mui/material";

export const PageWrapper = styled(Box)(({ theme }) => ({
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
}));

export default PageWrapper;
