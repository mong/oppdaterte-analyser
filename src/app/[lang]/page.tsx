import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Header from "@/components/Header";
import { Box } from "@mui/material";
import { Lang } from "@/types";

export const dynamicParams = false;
export async function generateStaticParams() {
  return [{ lang: "no" }, { lang: "en" }];
}

export type MainPageProps = {
  params: {
    lang: Lang;
  };
};

export default async function MainPage({ params }: MainPageProps) {
  return (
    <>
      <Header
        title="Oppdaterte resultater"
        introduction="Dette er hovedsiden for oppdaterte Helseatlas-analyser."
      />
      <main>
        <Box className="centered padding">
          <Typography>
            Benytt &ldquo;slug&rdquo; i URL for å se spesifikt kompendium, f.
            eks. <Link href={`/${params.lang}/barn`}>/{params.lang}/barn</Link>.
          </Typography>
        </Box>
      </main>
    </>
  );
}
