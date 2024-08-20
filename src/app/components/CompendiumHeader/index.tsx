import React from "react";
import Header from "@/app/components/Header";
import { getCompendiumBySlug } from "@/app/services/mongo";

interface CompendiumHeaderProps {
  compendiumSlug: string;
  lang: string;
}

export const CompendiumHeader = async ({
  compendiumSlug,
  lang,
}: CompendiumHeaderProps) => {
  const compendium = await getCompendiumBySlug(compendiumSlug);

  return (
    <Header
      title={compendium.title.get(lang)}
      subtitle={compendium.subtitle.get(lang)}
    ></Header>
  );
};

export default CompendiumHeader;
