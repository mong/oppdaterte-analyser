import "server-only";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  no: () => import("../dictionaries/no.json").then((module) => module.default),
  nn: () => import("../dictionaries/nn.json").then((module) => module.default)
};

export const getDictionary = async (lang: "en" | "no" | "nn") => dictionaries[lang]();
