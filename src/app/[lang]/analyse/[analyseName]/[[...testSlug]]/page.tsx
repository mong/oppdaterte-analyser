import { Suspense } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Header from "@/components/Header";
import { Analyse, Lang } from "@/types";
import { InteractiveChartContainer } from "@/components/AnalyseBox/InteractiveChartContainer";
import { getDictionary } from "@/lib/dictionaries";
import getAnalyseMarkdown from "@/lib/getAnalyseMarkdown";
import { getAnalyse, getTags } from "@/services/mongo";
import { formatDate } from "@/lib/helpers";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import UnderDevelopment from "@/components/UnderDevelopment";
import TagList from "@/components/TagList";
import DownloadDataButton from "@/components/DownloadDataButton";
import { notFound } from "next/navigation";

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
  const tags = await getTags(analyse.tags);
  const dict = await getDictionary(lang);

  return {
    title: `${analyse.title[lang]} - ${dict.general.updated_analyses}`,
    description: `${dict.general.updated_analyses}`,
    keywords: `${Object.values(tags)
      .map((tag) => tag.fullname[lang])
      .join(", ")}, ${dict.general.metadata_keywords}`,
  };
};

export default async function AnalysePage(props: {
  params: Promise<{ lang: Lang; analyseName: string; testSlug: string[] }>;
}) {
  const { lang, analyseName, testSlug } = await props.params;
  const { analyse } = await getCorrectAnalyse(analyseName, testSlug);

  if (!analyse || !["en", "no"].includes(lang)) {
    notFound();
  }

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
      text: dict.breadcrumbs.updated_analyses,
    },
    {
      link: `/${lang}/analyse/${analyse.name}/`,
      text: analyse.title[lang],
    },
  ];

  return (
    <>
      <Header
        lang={lang}
        breadcrumbs={breadcrumbs}
        title={analyse.title[lang]}
        introduction={`${dict.analysebox.updated} ${formatDate(analyse.updatedAt, lang)}`}
      >
        <Box sx={{ marginTop: 1 }}>
          <TagList analyse={analyse} tags={tags} lang={lang} />
        </Box>
      </Header>
      <main>
        <UnderDevelopment lang={lang} />
        <Suspense
          fallback={
            <Grid container justifyContent="center" sx={{ padding: 10 }}>
              <CircularProgress />
            </Grid>
          }
        >
          <AnalysePageContent lang={lang} analyse={analyse} />
        </Suspense>
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
    <Container
      maxWidth="xl"
      disableGutters={false}
      sx={{ paddingY: 4, paddingX: { xs: 0, md: 4 } }}
    >
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
      <InteractiveChartContainer
        analyse={props.analyse}
        lang={props.lang}
        dict={dict}
      />
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
    </Container>
  );
}
