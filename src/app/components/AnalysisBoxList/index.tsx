import { Suspense } from "react";
import mongoose from "mongoose";
import { Skeleton } from "@mui/material";
import { getCompendiumBySlug } from "@/app/services/mongo";
import AnalysisBox from "@/app/components/AnalysisBox";

type AnalysisBoxListProps = {
  kompendium: any;
  lang: string;
};

export default async function AnalysisBoxList({
  kompendium,
  lang,
}: AnalysisBoxListProps) {
  return (
    <Suspense
      fallback={<Skeleton variant="rectangular" width={210} height={60} />}
    >
      {kompendium.analysisIds.map((analysisBoxId: mongoose.Types.ObjectId) => {
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
