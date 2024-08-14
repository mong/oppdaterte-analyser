import Paper from "@mui/material/Paper";
import { getCompendium } from "@/app/services/mongo";

type ResultBoxListProps = {
  compendiumSlug: string;
  lang: string;
};

export default async function ResultBoxList({
  compendiumSlug,
  lang,
}: ResultBoxListProps) {
  const compendium = await getCompendium(compendiumSlug, lang);

  return (
    <Paper>
      {compendium.boxIds.map((boxId: number) => {
        return <div key={boxId}>{boxId}</div>;
      })}
    </Paper>
  );
}
