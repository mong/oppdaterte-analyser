import { Suspense } from "react";
import mongoose from "mongoose";
import { Skeleton } from "@mui/material";
import { getCompendiumBySlug } from "@/app/services/mongo";
import AnalysisBox from "@/app/components/AnalysisBox";

type AnalysisBoxListProps = {
  compendiumSlug: string;
  lang: string;
};

export default async function AnalysisBoxList({
  compendiumSlug: slug,
  lang,
}: AnalysisBoxListProps) {
  const compendium = await getCompendiumBySlug(slug);

  return (
    <Suspense fallback={<Skeleton />}>
      {compendium.analysisIds.map((analysisBoxId: mongoose.Types.ObjectId) => {
        return (
          <AnalysisBox
            key={analysisBoxId.toHexString()}
            boxId={analysisBoxId}
            lang={lang}
          />
        );
      })}
    </Suspense>
  );
}
