import Paper from "@mui/material/Paper";
import { Suspense } from "react";
import mongoose from "mongoose";
import { getCompendium } from "@/app/services/mongo";
import ResultBox from "@/app/components/ResultBox";

type ResultBoxListProps = {
  slug: string;
  lang: string;
};

export default async function ResultBoxList({
  slug,
  lang,
}: ResultBoxListProps) {
  const compendium = await getCompendium(slug, lang);

  return (
    <Suspense fallback={<Paper>Laster...</Paper>}>
      {compendium.boxes.map((boxId: mongoose.Types.ObjectId) => {
        return <ResultBox key={boxId.toHexString()} boxId={boxId} />;
      })}
    </Suspense>
  );
}
