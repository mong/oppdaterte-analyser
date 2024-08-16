import React from "react";
import { getCompendium } from "@/app/services/mongo";
import { Stack, Paper, Typography } from "@mui/material";

type CompendiumDatesProps = {
  slug: string;
  lang: string;
};

export const CompendiumDates = async ({ slug, lang }: CompendiumDatesProps) => {
  const compendium = await getCompendium(slug, lang);

  return (
    <Stack direction="row" spacing={2}>
      <Paper>Opprettet: {compendium.createdAt.toLocaleString("no")}</Paper>
      <Paper>Oppdatert: {compendium.updatedAt.toLocaleString("no")}</Paper>
    </Stack>
  );
};

export default CompendiumDates;
