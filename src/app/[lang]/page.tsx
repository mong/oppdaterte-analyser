import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Header from "@/app/components/Header";
import { Box } from "@mui/material";

export type MainPageProps = {
  params: {
    lang: "en" | "no";
  };
};

export default async function MainPage({ params }: MainPageProps) {
  return (
    <>
      <Header
        title="Oppdaterte resultater"
        introduction="Dette er hovedsiden for oppdaterte Helseatlas-resultater"
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
