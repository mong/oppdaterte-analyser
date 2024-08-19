import { Suspense } from "react";
import mongoose from "mongoose";
import { Skeleton } from "@mui/material";
import { getCompendiumBySlugAndLang } from "@/app/services/mongo";
import AnalysisBox from "@/app/components/AnalysisBox";

type AnalysisBoxListProps = {
  slug: string;
  lang: string;
};

export default async function AnalysisBoxList({
  slug,
  lang,
}: AnalysisBoxListProps) {
  const compendium = await getCompendiumBySlugAndLang(slug, lang);

  return (
    <Suspense fallback={<Skeleton />}>
      {compendium.analysisBoxIds.map(
        (analysisBoxId: mongoose.Types.ObjectId) => {
          return (
            <AnalysisBox
              key={analysisBoxId.toHexString()}
              boxId={analysisBoxId}
              lang={lang}
            />
          );
        },
      )}
    </Suspense>
  );
}
