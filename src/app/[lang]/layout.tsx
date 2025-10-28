import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import skdeTheme from "@/themes/SkdeTheme";
import Footer from "@/components/Footer";
import { Lang } from "@/types";
import MatomoTracker from "../MatomoTracker";
import { loginCredentials } from "@/lib/authorization";
import AdminBar from "@/components/AdminBar";

export const metadata: Metadata = {
  title: "Helseatlas oppdaterte analyser",
  description: "Visning av oppdaterte analyser fra Helseatlas",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;

  const credentials = await loginCredentials();

  return (
    <html lang={params.lang}>
      <MatomoTracker />
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={skdeTheme}>
            <CssBaseline />
            {credentials && <AdminBar {...credentials} />}
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {props.children}
              <Footer />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
