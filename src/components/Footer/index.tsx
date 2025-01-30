import Image from "next/image";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ArrowForward, ArrowOutward } from "@mui/icons-material";
import Link from "next/link";
import { Link as MUILink } from "@mui/material";
import { PropsWithChildren } from "react";

/*
  Most of the code for footers and headers is copied from https://github.com/mong/mongts
*/

export default function Footer() {
  return (
    <Box component="footer" style={{ marginTop: "auto" }}>
      <Box
        sx={{
          bgcolor: "footer1.main",
          color: "footer1.contrastText",
        }}
      >
        <Container maxWidth="xl" disableGutters={false} sx={{ padding: 4 }}>
          <Grid container size={{ xs: 12 }} sx={{ displayPrint: "none" }}>
            <Grid size={{ xs: 12, sm: 6 }} marginBottom={2} marginTop={2}>
              <Stack spacing={3}>
                <h4>OM NETTSTEDET</h4>
                <ArrowLink
                  href={"https://www.skde.no/om-skde/personvern/"}
                  text="Personvern"
                  textVariant="body2"
                />
                <ArrowLink
                  href={"https://www.skde.no/om-skde/informasjonskapsler/"}
                  text="Informasjonskapsler"
                  textVariant="body2"
                />
                <ArrowLink
                  href={
                    "https://uustatus.no/nb/erklaringer/publisert/589a8d23-4993-446e-b7eb-ef310bfe1dd7"
                  }
                  text="Tilgjengelighetserklæring"
                  textVariant="body2"
                  externalLink={true}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} marginTop={2}>
              <Stack spacing={3}>
                <h4>KONTAKT</h4>
                <ArrowLink
                  href={"https://www.skde.no/om-skde/kontaktinformasjon/"}
                  text="Kontakt SKDE"
                  textVariant="body2"
                />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "footer2.main", color: "footer2.contrastText" }}>
        <Container maxWidth="xl" disableGutters={false} sx={{ padding: 4 }}>
          <Grid
            size={{ xs: 12 }}
            container
            style={{ background: "#1A1A1A" }}
            paddingBottom={6}
            sx={{ overflow: "clip" }}
            rowGap={4}
            spacing={2}
          >
            <Grid container size={{ xs: 12 }} alignItems="center">
              <Grid
                container
                size={{ xs: 12 }}
                alignItems="center"
                paddingTop={2}
              >
                <Box sx={{ display: "block", displayPrint: "none" }}>
                  <Image
                    src="/img/logo-skde-neg.svg"
                    alt="SKDE-logo"
                    width={129}
                    height={52}
                    priority
                  />
                </Box>
                <Box sx={{ display: "none", displayPrint: "block" }}>
                  <Image
                    src="/img/logo-skde-graa.svg"
                    alt="SKDE-logo"
                    width={129}
                    height={52}
                    priority
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="body2">
                Senter for klinisk dokumentasjon og evaluering (SKDE) er en
                enhet i Helse Nord.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Stack>
                <b>TELEFON</b>
                <StyledLink href={"tel:77755800"}>77 75 58 00</StyledLink>
                <br />
                <b>EPOST</b>
                <StyledLink href={"mailto:postmottak@helse-nord.no"}>
                  postmottak@helse-nord.no
                </StyledLink>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Stack>
                <b>BESØKSADRESSE</b>
                Sykehusvegen 23 <br />
                9019 TROMSØ
                <StyledLink href={"https://maps.app.goo.gl/ohLzsYb8v6YvEDfL9"}>
                  Vis kart
                </StyledLink>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Grid>
                <Stack>
                  <b>ORGANISASJONSNUMMER</b>
                  883658752
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

const StyledLink = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => (
  <Link href={href} passHref legacyBehavior>
    <MUILink sx={{ textDecoration: "underline", color: "#c4dbf3" }}>
      {children}
    </MUILink>
  </Link>
);

type ArrowLinkProps = {
  href: string;
  text: string;
  externalLink?: boolean;
  button?: boolean;
  fontSize?: "small" | "inherit" | "large" | "medium";
  textVariant?:
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "button"
    | "overline";
};

export const ArrowLink = (props: ArrowLinkProps) => {
  const {
    href,
    text,
    externalLink = false,
    button = false,
    fontSize = "inherit",
    textVariant,
  } = props;

  let arrow: JSX.Element;
  let target: string;

  if (externalLink) {
    arrow = <ArrowOutward fontSize={fontSize} />;
    target = "_blank";
  } else {
    arrow = <ArrowForward fontSize={fontSize} />;
    target = "_self";
  }

  return button ? (
    <Button href={href} target={target} variant="text">
      <Stack alignItems="center" direction="row" gap={1}>
        <Typography variant={textVariant}>{text}</Typography>
        {arrow}
      </Stack>
    </Button>
  ) : (
    <Link href={href} target={target} passHref legacyBehavior>
      <MUILink
        sx={{ textDecoration: "none", color: "inherit", fontStyle: "normal" }}
      >
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography variant={textVariant}>{text}</Typography>
          {arrow}
        </Stack>
      </MUILink>
    </Link>
  );
};
