"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const jakartaStyle = plusJakartaSans.style;

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
    xxxl: true;
  }
  interface Palette {
    surface2: {
      main: string;
      light: string;
    };
  }
}

const fonts = {
  h1: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "300",
    fontSize: "4rem",
    letterSpacing: `-${1.5 / 16}rem`,
    color: "#001b52",
  },
  h2: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "300",
    fontSize: "3rem",
    letterSpacing: `-${0.5 / 16}rem`,
  },
  h3: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "400",
    fontSize: "2.5rem",
    letterSpacing: "0rem",
  },
  h4: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "400",
    fontSize: "2rem",
    letterSpacing: `${0.25 / 16}rem`,
  },
  h5: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "400",
    fontSize: `${28 / 16}rem`,
    letterSpacing: "0rem",
  },
  h6: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "500",
    fontSize: "1.5rem",
    letterSpacing: `${0.15 / 16}rem`,
  },
  subtitle1: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "400",
    fontSize: "1.25rem",
    letterSpacing: `${0.15 / 16}rem`,
  },
  subtitle2: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "500",
    fontSize: "1.25rem",
    letterSpacing: `${0.1 / 16}rem`,
  },
  body1: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "400",
    fontSize: `${18 / 16}rem`,
    letterSpacing: `${0.5 / 16}rem`,
  },
  body2: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "400",
    fontSize: "1rem",
    letterSpacing: `${0.25 / 16}rem`,
  },
  button: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "500",
    fontSize: "1rem",
    letterSpacing: `${1.25 / 16}rem`,
  },
  overline: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "500",
    fontSize: `${14 / 16}rem`,
    letterSpacing: `${1.5 / 16}rem`,
  },
  Breadcrumbs: {
    fontFamily: `${jakartaStyle.fontFamily}`,
    fontWeight: "400",
    fontSize: `${14 / 16}rem`,
    letterSpacing: `${0.25 / 16}rem`,
  },
};

export const breakpoints = {
  xs: 0,
  sm: 544,
  md: 768,
  lg: 992,
  xl: 1080,
  xxl: 1408,
  xxxl: 2560,
};

const colorTokens = {
  primary: {
    main: "#003087",
    light: "#e3ebf2",
    dark: "#001b52",
  },
  secondary: {
    main: "#bfc7e4",
    light: "#e6e9f4",
    dark: "#000000",
  },
  background: {
    main: "#dedede",
    light: "#fff",
    paper: "#fff",
    dark: "#9b9b9b",
  },
  surface: {
    main: "#5e7680",
    light: "#e0e7eb",
    dark: "#173844",
  },
  surface2: {
    main: "#399568",
    light: "#e0ebe5",
    dark: "#00531e",
  },
  footer1: {
    main: "#333",
    contrastText: "#fff",
  },

  footer2: {
    main: "#1a1a1a",
    contrastText: "#fff",
  },
  text: {
    primary: "#000",
    secondary: "#003087",
  },
};

export const skdeTheme = responsiveFontSizes(
  createTheme({
    typography: fonts,
    palette: {
      mode: "light",
      ...colorTokens,
    },
    breakpoints: {
      values: {
        ...breakpoints,
      },
    },
  }),
);

export default skdeTheme;
