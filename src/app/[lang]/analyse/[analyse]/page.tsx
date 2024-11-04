import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import Header from "@/components/Header";
import { Lang } from "@/types";

import { getAnalyse } from "@/services/mongo";

import { InteractiveChartContainer } from "@/components/AnalyseBox/InteractiveChartContainer";
import { getDictionary } from "@/lib/dictionaries";

export default async function AnalysePage({
  params,
}: {
  params: { lang: Lang; analyse: string };
}) {
  const analyse = await getAnalyse(params.analyse);
  const dict = await getDictionary(params.lang);

  return (
    <>
      <Header
        lang={params.lang}
        title={analyse.title[params.lang]}
        introduction={""}
      ></Header>
      <main>
        <Suspense
          fallback={
            <Box className="centered analyse-boxes" sx={{ paddingTop: 5 }}>
              <CircularProgress />
            </Box>
          }
        >
          <Box
            className="centered analyse-boxes"
            sx={{ paddingTop: "40px", maxWidth: 1200 }}
          >
            <InteractiveChartContainer
              analyse={analyse}
              lang={params.lang}
              dict={dict.analysebox}
            />
          </Box>
        </Suspense>
      </main>
    </>
  );
}
