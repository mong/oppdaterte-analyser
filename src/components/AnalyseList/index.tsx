import { Suspense } from "react";

import { Alert, Box, Skeleton } from "@mui/material";
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
      <Alert
        severity="info"
        sx={{ marginBottom: "20px", marginTop: "-20px", maxWidth: "1000px" }}
      >
        {dict.general.under_development}{" "}
        <a href="mailto:helseatlas@skde.no?subject=Tilbakemelding på sidene for oppdaterte analyser">
          helseatlas@skde.no
        </a>
        .
      </Alert>
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
