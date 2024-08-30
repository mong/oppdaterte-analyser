import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import skdeTheme from "@/app/themes/SkdeTheme";
import PageWrapper from "@/app/components/PageWrapper";
import Footer from "@/app/components/Footer";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "no" }];
}

export const metadata: Metadata = {
  title: "Helseatlas oppdaterte analyser",
  description: "Visning av oppdaterte analyser fra Helseatlas",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: "en" | "no" };
}>) {
  let messages;
  try {
    messages = (await import(`../../../messages/${params.lang}.json`)).default;
  } catch (error) {
    // Instead of calling notFound(), we'll use a default locale
    console.error(`Failed to load messages for locale ${params.lang}`, error);
    messages = (await import(`../../../messages/en.json`)).default;
    params.lang = "no";
  }

  return (
    <html lang={params.lang}>
      <body>
        <NextIntlClientProvider locale={params.lang} messages={messages}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={skdeTheme}>
              <CssBaseline />
              <PageWrapper>
                {children}
                <Footer />
              </PageWrapper>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
