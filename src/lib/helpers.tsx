import { Analyse, Lang, View } from "@/types";
import { Typography } from "@mui/material";

export function formatDate(date: Date | string, lang: Lang) {
  return new Date(date).toLocaleString({ en: "en-GB", no: "nb-NO" }[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function makeDateElem(date: Date | string, lang: Lang) {
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

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCategory(analyse: Analyse) {
  if (analyse.kategori_begrep) {
    return analyse.kategori_begrep;
  } else if (analyse.age_range[1] < 20) {
    return {
      begge: { en: "children", no: "barn" },
      kvinner: { en: "girls", no: "jenter" },
      menn: { en: "boys", no: "gutter" },
    }[analyse.kjonn];
  } else if (new Set(["kvinner", "menn"]).has(analyse.kjonn)) {
    return {
      kvinner: { en: "women", no: "kvinner" },
      menn: { en: "men", no: "menn" },
    }[analyse.kjonn as "menn" | "kvinner"];
  } else {
    return { en: "inhabitants", no: "innbyggere" };
  }
}

export function getVariableText(
  analyse: Analyse,
  lang: Lang,
  variable: { viewName: string; name: string },
) {
  const view = analyse.views.find((v) => v.name === variable.viewName) as View;
  const variableObject = view.variables.find(
    (v) => v.name === variable.name,
  ) as View["variables"][0];
  console.log("Variable object:", variableObject)
  return (
    <>
      {` (`}
      <i>{view.title[lang]}</i>
      {" = "}
      <i>{variableObject[lang]}</i>
      {")"}
    </>
  );
}

export function getDescription(
  analyse: Analyse,
  lang: Lang,
  type: "rate" | "n",
  aggregering: "kont" | "pas",
  variable?: { viewName: string; name: string },
) {
  const age_range = getAgeRange(analyse, lang);
  const age = age_range ? `, ${age_range}` : "";

  const variableText = variable && getVariableText(analyse, lang, variable);

  let kontaktType = {
    kont: { no: "kontakter", en: "contacts" },
    pas: { no: "pasienter", en: "patients" },
  }[aggregering][lang];
  if (aggregering === "kont" && analyse.kontakt_begrep) {
    kontaktType = analyse.kontakt_begrep[lang];
  }

  const kategori = getCategory(analyse)[lang];

  return (
    <Typography variant="body2">
      {type === "rate" ? (
        <>
          {analyse.description[lang]} – {kontaktType}{" "}
          {{ en: "per 1,000", no: "pr 1 000" }[lang]} {kategori}
          {age}
          {variableText}
        </>
      ) : (
        <>
          {analyse.description[lang]}
          {age}
          {variableText} – {{ en: "number of", no: "antall" }[lang]}{" "}
          {kontaktType}
        </>
      )}
    </Typography>
  );
}

export function getSubHeader(analyse: Analyse, lang: Lang) {
  const age_range = getAgeRange(analyse, lang);
  return `${age_range}, personer`;
}
