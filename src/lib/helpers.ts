import { Analyse, Lang } from "@/types";

export function formatDate(date: Date, lang: Lang) {
  return new Date(date).toLocaleString({ en: "en-GB", no: "nb-NO" }[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatNumber(
  number: number,
  lang: Lang,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(lang, {
    maximumFractionDigits:
      options?.style === "percent"
        ? Number(number < 0.1)
        : 1 + Number(number < 5) + Number(number < 0.5),
    ...options,
  }).format(number);
}

export function getAgeRange(analyse: Analyse, lang: Lang) {
  const [min_age, max_age] = analyse.age_range;
  switch (true) {
    case min_age === 0 && max_age > 100:
      return false;
    case max_age > 100:
      return `${min_age} ${{ en: "years and older", no: "år og eldre" }[lang]}`;
    default:
      return `${min_age}–${max_age} ${{ en: "years", no: "år" }[lang]}`;
  }
}

export function getDescription(
  analyse: Analyse,
  lang: Lang,
  type: "rate" | "antall",
) {
  const [_, description, per_1000, category] =
    /(.*)(\spe?r 1[\s,]000\s)(.*)/.exec(analyse.description[lang]) as string[];

  const age_range = getAgeRange(analyse, lang);
  const age = age_range ? `, ${age_range}` : "";

  switch (type) {
    case "rate":
      return description + per_1000 + category + age;
    case "antall":
      const hide_category =
        ["innbyggere", "inhabitants"].includes(category) ||
        description.includes(` ${category} `);
      return description + (hide_category ? "" : `, ${category}`) + age;
  }
}
