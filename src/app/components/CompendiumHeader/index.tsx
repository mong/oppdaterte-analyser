import React from "react";
import Header from "@/app/components/Header";
import { getCompendiumBySlugAndLang } from "@/app/services/mongo";

type CompendiumHeaderProps = {
  slug: string;
  lang: string;
};

export const CompendiumHeader = async ({
  slug,
  lang,
}: CompendiumHeaderProps) => {
  const compendium = await getCompendiumBySlugAndLang(slug, lang);

  return (
    <Header title={compendium.title} subtitle={compendium.subtitle}></Header>
  );
};

export default CompendiumHeader;
