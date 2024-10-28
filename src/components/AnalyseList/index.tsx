import { Suspense } from "react";

import { Box, Skeleton } from "@mui/material";
import AnalyseBox from "@/components/AnalyseBox";
import { Analyse, Tag, Lang } from "@/types";
import { getDictionary } from "@/lib/dictionaries";

type AnalyseListProps = {
  analyser: Analyse[];
  tags: { [k: string]: Tag };
  lang: Lang;
  rawHtmlFromMarkdown: { [k: string]: { [k: string]: string } };
};

export default async function AnalyseList({
  analyser,
  tags,
  lang,
  rawHtmlFromMarkdown,
}: AnalyseListProps) {
  const dict = await getDictionary(lang);

  return (
    <Box className="centered analyse-boxes" sx={{ padding: "40px 0" }}>
      <Suspense
        fallback={<Skeleton variant="rectangular" width={610} height={600} />}
      >
        {analyser.map((analyse) => {
          return (
            <AnalyseBox
              rawHtmlFromMarkdown={rawHtmlFromMarkdown[analyse.name]}
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
