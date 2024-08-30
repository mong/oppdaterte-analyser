import { Suspense } from "react";

import { Box, Skeleton } from "@mui/material";
import AnalyseBox from "@/components/AnalyseBox";
import { Analyse } from "@/models/AnalyseModel";
import { Tag } from "@/models/TagModel";
import { getDictionary } from "@/lib/dictionaries";

type AnalyseListProps = {
  analyser: Analyse[];
  tags: { [k: string]: Tag };
  lang: "en" | "no";
};

export default async function AnalyseList({
  analyser,
  tags,
  lang,
}: AnalyseListProps) {
  const dict = await getDictionary(lang);

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
              dict={dict.analysebox}
            />
          );
        })}
      </Suspense>
    </Box>
  );
}
