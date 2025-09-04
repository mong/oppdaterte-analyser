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

import { getAnalyserByTag, getTag } from "@/services/mongo";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import { markdownToHtml, stripMarkdown } from "@/lib/getMarkdown";
import { getSubHeader, makeDateElem } from "@/lib/helpers";

export const generateMetadata = async (props: {
  params: Promise<{ lang: Lang; kompendium: string }>;
}) => {
  const { kompendium, lang } = await props.params;
  const tag = await getTag(kompendium);
  const dict = await getDictionary(lang);

  return {
    title: `${tag.fullname[lang]} - ${dict.general.updated_health_atlas}`,
    description: tag.introduction
      ? await stripMarkdown(tag.introduction[lang])
      : `${dict.general.updated_health_atlas}: ${tag.fullname[lang]}`,
    keywords: `${tag.fullname[lang]}, ${dict.general.metadata_keywords}`,
  };
};

export default async function KompendiumPage(props: {
  params: Promise<{ lang: Lang; kompendium: string }>;
}) {
  const { kompendium, lang } = await props.params;
  const tag = await getTag(kompendium);
  if (!tag || !["en", "no"].includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const analyser = await getAnalyserByTag(
    kompendium,
    `title.${lang}`,
    "-data -demografi -views -discussion -info",
  );

  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.breadcrumbs.homepage,
    },
    {
      link: "https://www.skde.no/helseatlas/",
      text: dict.breadcrumbs.health_atlas,
    },
    {
      link: `/${lang}/`,
      text: dict.breadcrumbs.updated_health_atlas,
    },
    {
      link: `/${lang}/${kompendium}/`,
      text: tag.fullname[lang],
    },
  ];

  return (
    <>
      <Header lang={lang} breadcrumbs={breadcrumbs} title={tag.fullname[lang]}>
        <Typography
          variant="h6"
          sx={{
            "& > p": { margin: 0, marginTop: 2 },
            "& a": { color: "primary.main" },
          }}
          dangerouslySetInnerHTML={{
            __html: await markdownToHtml(tag.introduction?.[lang] || ""),
          }}
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
            <Stack spacing={4} sx={{ padding: 4 }}>
              {analyser.map(async (analyse) => (
                <Link
                  href={`/${lang}/analyse/${analyse.name}`}
                  target="_blank"
                  underline="none"
                  color="inherit"
                >
                  <Paper
                    sx={{
                      padding: 2,
                      "&:hover": {
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
                          <Typography variant="h4">
                            {analyse.title[lang]}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ paddingX: 1, marginTop: 0.5 }}>
                        <Typography variant="body1" sx={{ color: "#444" }}>
                          {getSubHeader(analyse, lang)}
                        </Typography>
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{
                            width: "100%",
                            "@media print": { fontSize: "1rem" },
                          }}
                          dangerouslySetInnerHTML={{
                            __html: await markdownToHtml(analyse.summary[lang]),
                          }}
                        />
                      </Box>
                      <Grid>
                        <Typography variant="body2">
                          {makeDateElem(analyse.createdAt, lang)}
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
