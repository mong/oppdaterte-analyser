import { Suspense } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Header from "@/components/Header";
import { Analyse, Lang } from "@/types";
import { ChartContainer } from "@/components/AnalyseBox/ChartContainer";
import { getDictionary } from "@/lib/dictionaries";
import { getAnalyseMarkdown } from "@/lib/getMarkdown";
import { getAnalyse, getTags } from "@/services/mongo";
import { getSubHeader, makeDateElem } from "@/lib/helpers";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import TagList from "@/components/TagList";
import DownloadDataButton from "./DownloadDataButton";
import { notFound } from "next/navigation";
import { Compare } from "@/components/Compare";

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

  const tags = await getTags(analyse.tags);
  const dict = await getDictionary(lang);

  return {
    title: `${analyse.title[lang]} - ${dict.general.updated_health_atlas}`,
    description: `${dict.general.updated_health_atlas}`,
    keywords: `${Object.values(tags)
      .map((tag) => tag.fullname[lang])
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

  const oldAnalyse = testPage && (await getAnalyse(analyseName, "published"));

  const tags = await getTags(analyse.tags);
  const dict = await getDictionary(lang);

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
      link: `/${lang}/analyse/${analyse.name}/`,
      text: analyse.title[lang],
    },
  ];

  const bottomGrid = (
    <Grid
      container
      sx={{ justifyContent: "space-between", alignItems: "flex-end" }}
    >
      <Grid size="grow">
        <TagList
          tags={analyse.tags.map((tagName) => tags[tagName] || tagName)}
          lang={lang}
        />
      </Grid>
      <Grid>
        <Typography variant="body2">
          {dict.analysebox.updated} {makeDateElem(analyse.createdAt, lang)}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <>
      <Header lang={lang} breadcrumbs={breadcrumbs} title={analyse.title[lang]}>
        <Typography variant="h6" sx={{ marginY: 2 }}>
          {getSubHeader(analyse, lang)}
        </Typography>
        {bottomGrid}
      </Header>
      <main>
        <Container
          maxWidth="xl"
          disableGutters={false}
          sx={{ paddingY: 4, paddingX: { xs: 0, md: 4 } }}
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
            <AnalysePageContent lang={lang} analyse={analyse} />
          </Suspense>
        </Container>
      </main>
    </>
  );
}

async function AnalysePageContent(props: { lang: Lang; analyse: Analyse }) {
  const dict = await getDictionary(props.lang);
  const rawHtmlFromMarkdown = await getAnalyseMarkdown(
    props.analyse,
    props.lang,
  );

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h3">{dict.analysebox.summary}</Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ "@media print": { fontSize: "1rem" } }}
          dangerouslySetInnerHTML={{
            __html: rawHtmlFromMarkdown.summary,
          }}
        />
      </Box>
      <ChartContainer analyse={props.analyse} lang={props.lang} dict={dict} />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h3">{dict.analysebox.discussion}</Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ "@media print": { fontSize: "1rem" } }}
          dangerouslySetInnerHTML={{
            __html: rawHtmlFromMarkdown.discussion,
          }}
        />

        <Typography variant="h3">{dict.analysebox.info}</Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ "@media print": { fontSize: "1rem" } }}
          dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.info }}
        />

        <Typography variant="h3">Data</Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ "@media print": { fontSize: "1rem" } }}
        >
          <p>{dict.analysebox.download_data_text}</p>
        </Typography>
        <Box sx={{ displayPrint: "none" }}>
          <DownloadDataButton
            analyse={props.analyse}
            lang={props.lang}
            dict={dict}
          />
        </Box>
      </Box>
    </>
  );
}
