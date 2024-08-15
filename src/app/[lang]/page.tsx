import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Header from "@/app/components/Header";
import { PropsWithChildren } from "react";

export type HomeProps = {
  params: {
    lang: "en" | "no";
  };
};

export default function Home({
  children,
  params,
}: PropsWithChildren<HomeProps>) {
  return (
    <>
      <Header
        title="Oppdaterte resultater"
        subtitle="Dette er hovedsiden for oppdaterte Helseatlas-resultater"
      />
      <main>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography>
              Benytt &ldquo;slug&rdquo; i URL for å se spesifikt kompendium, f.
              eks.{" "}
              <Link href={`/${params.lang}/barn`}>/{params.lang}/barn</Link>.
            </Typography>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
