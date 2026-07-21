import { formatLocale, FormatLocaleDefinition } from "d3-format";

export function customFormat(
  numberFormat: string,
  lang?: "en" | "nb" | "nn" | "no",
) {
  const formatDefinition: FormatLocaleDefinition =
    lang === "en"
      ? {
        decimal: ".",
        thousands: ",",
        grouping: [3],
        currency: ["USD", ""],
        percent: "%",
      }
      : {
        decimal: ",",
        thousands: "\u202f",
        grouping: [3],
        currency: ["NOK", ""],
        percent: "\u202f%",
      };
  try {
    return formatLocale(formatDefinition).format(numberFormat);
  } catch (_) {
    return formatLocale(formatDefinition).format(".0f");
  }
}


const maincolor: string = "73, 147, 212";

export const mapColors: string[] = [
  `rgba(${maincolor}, 0.25)`,
  `rgba(${maincolor}, 0.5)`,
  `rgba(${maincolor}, 0.75)`,
  `rgba(${maincolor}, 1.0)`,
];


export const linechartColors: string[] = [
  "#253776",
  "#74A5CD",
  "#6D8480",
  "#4AB69B",
  "#99C326",
  "#C0614E",
  "#901D81",
  "#ADB8B3",
  "#B6D7A5",
];

export const nationalLabel = { en: "Norway", nb: "Norge", nn: "Noreg" };
