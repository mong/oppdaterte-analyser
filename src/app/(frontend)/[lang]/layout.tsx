// "use client";
import type { Metadata } from "next";
//import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
//import { ThemeProvider } from "@mui/material/styles";
import { Box /*, CssBaseline*/ } from "@mui/material";
//import skdeTheme from "@/themes/SkdeTheme";

import MatomoTracker from "../MatomoTracker";
import AdminBar from "@/components/AdminBar";
import { draftMode } from "next/headers";
import {
  SkdeThemeProvider,
  MainLayout,
  Footer,
  PageLayout,
} from "@mong/material-ui";

// import "@mong/material-ui/variables.css";
// import "@mong/material-ui/theme.css";
import './globals.css'
// import "@mong/material-ui/index.css";
// import "@mong/material/ui-material-ui.css";
// import "@mong/material/ui-index.css";

export const metadata: Metadata = {
  title: "Helseatlas oppdaterte analyser",
  description: "Visning av oppdaterte analyser fra Helseatlas",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { isEnabled } = await draftMode()
  const { lang } = await props.params;

  return (
    <html lang={lang}>
      <MatomoTracker />
      <body>
        <AdminBar preview={isEnabled} />
        <SkdeThemeProvider>
          <MainLayout>

            <PageLayout>{props.children}</PageLayout>
            <Footer lang={"no"} />
          </MainLayout>
        </SkdeThemeProvider>
      </body>
    </html>
  );
}
