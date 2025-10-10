import { Suspense } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { HeaderTop } from "@/components/Header";
import { Analyse, Lang } from "@/types";
import { ChartContainer } from "@/components/Charts/ChartContainer";
import { getDictionary } from "@/lib/dictionaries";
import { getAnalyseMarkdown } from "@/lib/getMarkdown";
import { getAnalyse } from "@/services/mongo";
import { makeDateElem } from "@/lib/helpers";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import TagList from "@/components/TagList";
import DownloadDataButton from "./DownloadDataButton";
import { notFound } from "next/navigation";
import { Compare } from "@/components/Compare";
import { getTags } from "@/services/payload";
//import { Compare } from "@/components/Compare";

const getCorrectAnalyse = async (analyseName: string, testSlug: string[]) => {
  const testPage = Boolean(
    testSlug !== undefined &&
      [1, 2].includes(testSlug.length) &&
      testSlug[0] === "test" &&
      (testSlug.length === 1 || testSlug[1].match(/^\d+$/)),
  );

  if (testSlug && !testPage) {
    notFound();
  }

  const analyse = await getAnalyse(
    analyseName,
    !testPage ? "published" : Number(testSlug[1] || 0),
  );

  return { testPage, analyse };
};

export const generateMetadata = async (props: {
  params: Promise<{ lang: Lang; analyseName: string; testSlug: string[] }>;
}) => {
  const { lang, analyseName, testSlug } = await props.params;
  const { analyse } = await getCorrectAnalyse(analyseName, testSlug);

  if (!analyse) notFound();

  const tags = await getTags({ tags: analyse.tags, lang });

  const dict = await getDictionary(lang);

  return {
    title: `${analyse.title[lang]} - ${dict.general.updated_health_atlas}`,
    description: `${dict.general.updated_health_atlas}`,
    keywords: `${Object.values(tags)
      .map((tag) => tag.title)
      .join(", ")}, ${dict.general.metadata_keywords}`,
  };
};

export default async function AnalysePage(props: {
  params: Promise<{ lang: Lang; analyseName: string; testSlug: string[] }>;
}) {
  const { lang, analyseName, testSlug } = await props.params;
  const { testPage, analyse } = await getCorrectAnalyse(analyseName, testSlug);

  if (!analyse || !["en", "no"].includes(lang)) {
    notFound();
  }

  const rawHtmlFromMarkdown = await getAnalyseMarkdown(analyse, lang);
  //const oldAnalyse = testPage && (await getAnalyse(analyseName, "published"));

  const dict = await getDictionary(lang);

  const tags = await getTags({ tags: analyse.tags, lang });
  console.log({ tags });

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
      link: `/${lang}/analyse/${analyse.name}`,
      text: analyse.title[lang],
    },
  ];

  return (
    <>
      <HeaderTop breadcrumbs={breadcrumbs} lang={lang}></HeaderTop>
      <main>
        <Container
          maxWidth="xxl"
          disableGutters={false}
          sx={{ paddingBottom: 4, paddingX: { xs: 2, md: 4 } }}
        >
          {analyse.version === 0 && (
            <Alert severity="warning">
              Dette er en test-side! Denne analysen er fortsatt ikke publisert.
            </Alert>
          )}
          <Suspense
            fallback={
              <Grid container justifyContent="center" sx={{ padding: 10 }}>
                <CircularProgress />
              </Grid>
            }
          >
            {testPage && (
              <Paper
                elevation={0}
                sx={{
                  marginTop: 2,
                  padding: 2,
                  paddingY: 4,
                  borderRadius: 10,
                  boxShadow: "inset 0 0 25px #003087",
                  background: "#F9F9F9",
                }}
              >
                <Compare
                  newAnalyse={analyse}
                  oldAnalyse={await getAnalyse(analyseName, "published")}
                />
              </Paper>
            )}
            <Box sx={{ padding: 2 }}>
              <Typography variant="h3">{analyse.title[lang]}</Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ "@media print": { fontSize: "1rem" } }}
                dangerouslySetInnerHTML={{
                  __html: rawHtmlFromMarkdown.summary,
                }}
              />
            </Box>
            <ChartContainer analyse={analyse} lang={lang} dict={dict} />

            <Typography
              variant="body1"
              component="div"
              sx={{ "@media print": { fontSize: "1rem" }, marginTop: 4 }}
              dangerouslySetInnerHTML={{
                __html: rawHtmlFromMarkdown.discussion,
              }}
            />

            <Stack spacing={2} sx={{ marginTop: 2, marginBottom: 4 }}>
              <TagList
                tags={analyse.tags.map((tagName) => tags[tagName] || tagName)}
                lang={lang}
              />
              <Typography variant="body2">
                {dict.analysebox.updated}{" "}
                {makeDateElem(analyse.createdAt, lang)}
              </Typography>
            </Stack>

            <Box
              sx={{
                background: "#343434",
                padding: 2,
                borderRadius: "8px",
                color: "#D7D7D7",
              }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                {dict.analysebox.info}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{ "@media print": { fontSize: "1rem" } }}
                dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.info }}
              />
            </Box>
          </Suspense>
        </Container>
      </main>
    </>
  );
}
