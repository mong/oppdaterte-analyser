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

export default async function AnalysePage({
  params,
}: {
  params: { lang: Lang; analyse: string };
}) {
  const analyse = await getAnalyse(params.analyse);
  const dict = await getDictionary(params.lang);
  const rawHtmlFromMarkdown = await getAnalyseMarkdown(analyse, params.lang);

  return (
    <>
      <Header
        lang={params.lang}
        title={analyse.title[params.lang]}
        introduction={`${dict.analysebox.updated}: ${formatDate(analyse.published, params.lang)}`}
      ></Header>
      <main>
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
              lang={params.lang}
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
