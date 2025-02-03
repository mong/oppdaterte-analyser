import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import skdeTheme from "@/themes/SkdeTheme";
import Footer from "@/components/Footer";
import { Lang } from "@/types";
import MatomoTracker from "./MatomoTracker";

export const dynamicParams = false;
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "no" }];
}

export const metadata: Metadata = {
  title: "Helseatlas oppdaterte analyser",
  description: "Visning av oppdaterte analyser fra Helseatlas",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { lang: Lang };
  }>,
) {
  const params = await props.params;

  const { children } = props;

  return (
    <html lang={params.lang}>
      <MatomoTracker />
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={skdeTheme}>
            <CssBaseline />
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {children}
              <Footer />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
