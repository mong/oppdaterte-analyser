import { Suspense } from "react";

import { Box, CircularProgress } from "@mui/material";
import { Analyse, Lang } from "@/types";
import { getDictionary } from "@/lib/dictionaries";
import AnalyseBoxWrapper from "../AnalyseBoxWrapper";

type AnalyseListProps = {
  analyser: Analyse[];
  lang: Lang;
};

export default async function AnalyseList({
  analyser,
  lang,
}: AnalyseListProps) {
  const dict = await getDictionary(lang);

  return (
    <Suspense
      fallback={
        <Box sx={{ paddingTop: 5 }}>
          <CircularProgress />
        </Box>
      }
    >
      {analyser.map((analyse) => {
        return (
          <AnalyseBoxWrapper
            key={analyse.name}
            analyseName={analyse.name}
            lang={lang}
          />
        );
      })}
    </Suspense>
  );
}
