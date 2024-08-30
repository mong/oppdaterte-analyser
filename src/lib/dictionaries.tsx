import "server-only";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  no: () => import("../dictionaries/no.json").then((module) => module.default),
};

export const getDictionary = async (lang: "en" | "no") => dictionaries[lang]();
