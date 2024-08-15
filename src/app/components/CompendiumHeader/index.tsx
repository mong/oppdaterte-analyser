import React from "react";
import Header from "@/app/components/Header";
import { getCompendium } from "@/app/services/mongo";

type CompendiumHeaderProps = {
  slug: string;
  lang: string;
};

export const CompendiumHeader = async ({
  slug,
  lang,
}: CompendiumHeaderProps) => {
  const compendium = await getCompendium(slug, lang);

  return <Header title={compendium.title} subtitle={compendium.subtitle} />;
};

export default CompendiumHeader;
