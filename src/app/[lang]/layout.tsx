import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import skdeTheme from "../themes/SkdeTheme";

export const dynamicParams = false;
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "no" }];
}

export const metadata: Metadata = {
  title: "Helseatlas oppdaterte analyser",
  description: "Visning av oppdaterte analyser fra Helseatlas",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: "en" | "no" };
}>) {
  return (
    <html lang={params.lang}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={skdeTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
