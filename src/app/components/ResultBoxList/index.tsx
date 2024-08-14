import { dbConnect } from "@/app/services/mongo";
import compendiums from "@/app/models/compendiumModel";
import Paper from "@mui/material/Paper";

const getCompendium = async (compendiumSlug: string) => {
  await dbConnect();

  return await compendiums.findOne({ slug: compendiumSlug }).exec();
};

export default async function ResultBoxList({
  compendiumSlug,
}: {
  compendiumSlug: string;
}) {
  const compendium = await getCompendium(compendiumSlug);

  return (
    <Paper>
      {compendium.boxIds.map((boxId: number) => {
        return <div key={boxId}>{boxId}</div>;
      })}
    </Paper>
  );
}
