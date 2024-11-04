import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import Header from "@/components/Header";
import { Lang } from "@/types";

import { getAnalyse } from "@/services/mongo";

import AnalyseBoxWrapper from "@/components/AnalyseBoxWrapper";

export default async function AnalysePage({
  params,
}: {
  params: { lang: Lang; analyse: string };
}) {
  const analyse = await getAnalyse(params.analyse);

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
          <Box className="centered" sx={{ paddingTop: "40px" }}>
            <AnalyseBoxWrapper
              analyseName={params.analyse}
              lang={params.lang}
            />
          </Box>
        </Suspense>
      </main>
    </>
  );
}
