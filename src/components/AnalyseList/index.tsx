import { Suspense } from "react";

import { Alert, Box, CircularProgress } from "@mui/material";
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
        fallback={
          <Box className="centered" sx={{ paddingTop: 5 }}>
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
    </Box>
  );
}
