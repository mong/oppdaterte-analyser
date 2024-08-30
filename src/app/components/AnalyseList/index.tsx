import { Suspense } from "react";

import { Box, Skeleton } from "@mui/material";
import AnalyseBox from "@/app/components/AnalyseBox";
import { Analyse } from "@/app/models/AnalyseModel";

type AnalyseListProps = {
  analyser: Analyse[];
  lang: string;
};

export default async function AnalyseList({
  analyser,
  lang,
}: AnalyseListProps) {
  return (
    <Box className="centered" sx={{ padding: "40px 0" }}>
      <Suspense
        fallback={<Skeleton variant="rectangular" width={610} height={600} />}
      >
        {analyser.map((analyse) => {
          return (
            <AnalyseBox key={analyse.name} analyse={analyse} lang={lang} />
          );
        })}
      </Suspense>
    </Box>
  );
}
