import { Suspense } from "react";
import {
  CircularProgress,
  Container,
  Stack,
  Box,
  Grid,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import Header from "@/components/Header";
import { Lang } from "@/types";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";


import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import { getSubHeader, makeDateElem } from "@/lib/helpers";
import RichText from "@/components/RichText";

import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";

import { getAnalyserByTag, getTag } from "@/services/payload";
import React from "react";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [];

  const payload = await getPayload({ config: configPromise })
  const result = (await Promise.all((["en", "no"] as Lang[]).map(async (lang) =>
    (await payload.find({
      collection: 'tags',
      draft: false,
      limit: 0,
      locale: lang,
      fallbackLocale: false,
      overrideAccess: false,
      pagination: false,
      select: {
        identifier: true,
      },
    })).docs.map(({ identifier }) => ({ kompendium: identifier, lang }))
  ))).flat();
  return result;
}


export const generateMetadata = async (props: {
  params: Promise<{ lang: Lang; kompendium: string }>;
}) => {
  const { kompendium, lang } = await props.params;
  const tag = await getTag({ identifier: kompendium, lang });

  if (!tag || !["en", "no"].includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return {
    title: `${tag.title} - ${dict.general.updated_health_atlas}`,
    description: tag.description
      ? convertLexicalToPlaintext({ data: tag.description })
      : `${dict.general.updated_health_atlas}: ${tag.title}`,
    keywords: `${tag.title}, ${dict.general.metadata_keywords}`,
  };
};

export default async function KompendiumPage(props: {
  params: Promise<{ lang: Lang; kompendium: string }>;
}) {
  const { kompendium, lang } = await props.params;

  const tag = await getTag({ identifier: kompendium, lang });

  if (!tag || !["en", "no"].includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  const payload_analyser = await getAnalyserByTag({
    identifier: kompendium,
    lang,
  });

  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.breadcrumbs.homepage,
    },
    {
      link: "https://www.skde.no/helseatlas",
      text: dict.breadcrumbs.health_atlas,
    },
    {
      link: `/${lang}`,
      text: dict.breadcrumbs.updated_health_atlas,
    },
    {
      link: `/${lang}/${kompendium}`,
      text: tag.title,
    },
  ];

  return (
    <>
      <Header lang={lang} breadcrumbs={breadcrumbs} title={tag.title}>
        <Typography
          variant="h6"
          sx={{
            "& > p": { margin: 0, marginTop: 2 },
            "& a": { color: "primary.main" },
          }}
        />
        <RichText
          data={tag.description!}
          enableGutter={false}
          enableProse={false}
        />
      </Header>
      <main>
        <Container maxWidth="xxl" disableGutters={true}>
          <Suspense
            fallback={
              <Grid container justifyContent="center" sx={{ padding: 10 }}>
                <CircularProgress />
              </Grid>
            }
          >
            <Stack spacing={5} sx={{ padding: 4 }}>
              {payload_analyser.map(async (analyse, i) => (
                <Link
                  href={`/${lang}/analyse/${analyse.slug}`}
                  target="_blank"
                  underline="none"
                  color="inherit"
                  key={i}
                >
                  <Paper
                    sx={{
                      padding: 2,
                      borderRadius: "1rem",
                      filter: "brightness(1.05)",
                      bgcolor: "primary.light",
                      "&:hover": {
                        filter: "brightness(1.07)",
                        boxShadow: 3,
                        cursor: "pointer",
                      },
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Grid container sx={{ justifyContent: "space-between" }}>
                        <Grid
                          size="grow"
                          sx={{ paddingTop: 1, paddingLeft: 1 }}
                        >
                          <Typography variant="h4">{analyse.title}</Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ paddingX: 1, marginTop: 0.5 }}>
                        <Typography variant="body1" sx={{ color: "#444" }}>
                          {getSubHeader(analyse.data, lang)}
                        </Typography>
                        <RichText data={analyse.summary} enableGutter={true} />
                      </Box>
                      <Grid>
                        <Typography variant="body2">
                          {makeDateElem(
                            analyse.publishedAt || analyse.createdAt,
                            lang,
                          )}
                        </Typography>
                      </Grid>
                    </Box>
                  </Paper>
                </Link>
              ))}
            </Stack>
          </Suspense>
        </Container>
      </main>
    </>
  );
}
