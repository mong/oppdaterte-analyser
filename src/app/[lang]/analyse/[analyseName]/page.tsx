import { Suspense } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Header from "@/components/Header";
import { Lang } from "@/types";
import { InteractiveChartContainer } from "@/components/AnalyseBox/InteractiveChartContainer";
import { getDictionary } from "@/lib/dictionaries";
import getAnalyseMarkdown from "@/lib/getAnalyseMarkdown";
import { getAnalyse } from "@/services/mongo";
import { formatDate } from "@/lib/helpers";
import CenteredContainer from "@/components/CenteredContainer";
import { BreadCrumbStop } from "@/components/Header/SkdeBreadcrumbs";
import UnderDevelopment from "@/components/UnderDevelopment";

export default async function AnalysePage(props: {
  params: { lang: Lang; analyseName: string };
}) {
  const { lang, analyseName } = props.params;
  const analyse = await getAnalyse(analyseName);
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
      ></Header>
      <main>
        <UnderDevelopment lang={lang} />
        <Suspense
          fallback={
            <Box sx={{ paddingTop: 4 }}>
              <CircularProgress />
            </Box>
          }
        >
          <CenteredContainer analyseBox={true}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h3">Oppsummert</Typography>
              <div
                dangerouslySetInnerHTML={{
                  __html: rawHtmlFromMarkdown.summary,
                }}
              />
            </Box>
            <InteractiveChartContainer
              analyse={analyse}
              lang={lang}
              dict={dict.analysebox}
            />
            <Box sx={{ padding: 2 }}>
              <Typography variant="h3">Diskusjon</Typography>
              <div
                dangerouslySetInnerHTML={{
                  __html: rawHtmlFromMarkdown.discussion,
                }}
              />
              <Typography variant="h3">{dict.analysebox.info}</Typography>
              <div
                dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.info }}
              />
            </Box>
          </CenteredContainer>
        </Suspense>
      </main>
    </>
  );
}
