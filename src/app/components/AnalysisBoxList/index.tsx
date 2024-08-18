import Paper from "@mui/material/Paper";
import { Suspense } from "react";
import mongoose from "mongoose";
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
    <Suspense fallback={<Paper>Laster...</Paper>}>
      {compendium.analysisBoxIds.map(
        (analysisBoxId: mongoose.Types.ObjectId) => {
          return (
            <AnalysisBox
              key={analysisBoxId.toHexString()}
              boxId={analysisBoxId}
            />
          );
        },
      )}
    </Suspense>
  );
}
