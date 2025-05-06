import { Analyse, Lang } from "@/types";

export function formatDate(date: Date, lang: Lang) {
  return new Date(date).toLocaleString({ en: "en-GB", no: "nb-NO" }[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function makeDateElem(date: Date, lang: Lang) {
  return (
    <time dateTime={new Date(date).toISOString()}>
      {formatDate(date, lang)}
    </time>
  );
}

export function formatNumber(
  number: number,
  lang: Lang,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(lang, {
    maximumFractionDigits:
      options?.style === "percent"
        ? Number(number < 0.1) + Number(number < 0.05) + Number(number < 0.0015)
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

export function getDescriptionParts(description_string: string) {
  const match = /(.*)(\spe?r 1[\s,]000\s)(.*)/.exec(description_string);

  if (match === null) return false;

  const [_, description, per_1000, category] = match;
  return {
    description,
    per_1000,
    category,
    category_is_population: ["innbyggere", "inhabitants"].includes(category),
  };
}

export function getDescription(
  analyse: Analyse,
  lang: Lang,
  type: "rate" | "antall",
) {
  const parts = getDescriptionParts(analyse.description[lang]);

  if (!parts) return "Parse error. Noe er feil med beskrivelsen!";

  const { description, per_1000, category, category_is_population } = parts;

  const age_range = getAgeRange(analyse, lang);
  const age = age_range ? `, ${age_range}` : "";

  switch (type) {
    case "rate":
      return description + per_1000 + category + age;
    case "antall":
      return (
        description +
        (category_is_population || description.includes(` ${category} `)
          ? ""
          : `, ${category}`) +
        age
      );
  }
}

export function getSubHeader(analyse: Analyse, lang: Lang) {
  const parts = getDescriptionParts(analyse.description[lang]);

  if (!parts) return "Parse error. Noe er feil med beskrivelsen!";
  const { category, category_is_population } = parts;

  const ageRangeText = getAgeRange(analyse, lang);
  return [
    !category_is_population &&
      category[0].toUpperCase() + category.substring(1),
    ageRangeText,
  ]
    .filter(Boolean)
    .join(", ");
}
