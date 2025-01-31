import { Suspense } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import Header from "@/components/Header";
import { Lang } from "@/types";
import { InteractiveChartContainer } from "@/components/AnalyseBox/InteractiveChartContainer";
import { getDictionary } from "@/lib/dictionaries";
import getAnalyseMarkdown from "@/lib/getAnalyseMarkdown";
import { getAnalyse, getTags } from "@/services/mongo";
import { formatDate } from "@/lib/helpers";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import UnderDevelopment from "@/components/UnderDevelopment";
import TagList from "@/components/TagList";
import DownloadDataButton from "@/components/DownloadDataButton";

export const generateMetadata = async (props: {
  params: { lang: Lang; analyseName: string };
}) => {
  const { analyseName, lang } = props.params;
  const analyse = await getAnalyse(analyseName);
  const tags = await getTags(analyse.tags);
  const dict = await getDictionary(lang);

  return {
    title: `${analyse.title[lang]} - ${dict.general.updated_analyses}`,
    description: `${dict.general.updated_analyses}`,
    keywords: `${Object.values(tags)
      .map((tag) => tag.fullname[lang])
      .join(", ")}`,
  };
};

export default async function AnalysePage(props: {
  params: { lang: Lang; analyseName: string };
}) {
  const { lang, analyseName } = props.params;
  const analyse = await getAnalyse(analyseName);
  const tags = await getTags(analyse.tags);
  const dict = await getDictionary(lang);
  const rawHtmlFromMarkdown = await getAnalyseMarkdown(analyse, lang);

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
      link: "https://www.skde.no/helseatlas/oppdaterte-analyser/",
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
        introduction={`${dict.analysebox.updated} ${formatDate(analyse.published, lang)}`}
      >
        <Box sx={{ marginTop: 1 }}>
          <TagList analyse={analyse} tags={tags} lang={lang} />
        </Box>
      </Header>
      <main>
        <UnderDevelopment lang={lang} />
        <Suspense
          fallback={
            <Box sx={{ paddingTop: 4 }}>
              <CircularProgress />
            </Box>
          }
        >
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
              analyse={analyse}
              lang={lang}
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
                <DownloadDataButton analyse={analyse} lang={lang} dict={dict} />
              </Box>
            </Box>
          </Container>
        </Suspense>
      </main>
    </>
  );
}
