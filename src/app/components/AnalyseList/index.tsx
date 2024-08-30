import { Suspense } from "react";

import { Box, Skeleton } from "@mui/material";
import AnalyseBox from "@/app/components/AnalyseBox";
import { Analyse } from "@/app/models/AnalyseModel";
import { Tag } from "@/app/models/TagModel";

type AnalyseListProps = {
  analyser: Analyse[];
  tags: { [k: string]: Tag };
  lang: string;
};

export default async function AnalyseList({
  analyser,
  tags,
  lang,
}: AnalyseListProps) {
  return (
    <Box className="centered" sx={{ padding: "40px 0" }}>
      <Suspense
        fallback={<Skeleton variant="rectangular" width={610} height={600} />}
      >
        {analyser.map((analyse) => {
          return (
            <AnalyseBox
              key={analyse.name}
              analyse={analyse}
              tags={tags}
              lang={lang}
            />
          );
        })}
      </Suspense>
    </Box>
  );
}
