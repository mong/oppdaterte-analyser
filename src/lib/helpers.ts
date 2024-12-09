import { Lang } from "@/types";

export function formatDate(date: number, lang: Lang) {
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
  const digits = number < 0.5 ? 3 : number < 5 ? 2 : 1;
  return new Intl.NumberFormat(lang, {
    maximumFractionDigits: options?.style === "percent" ? 1 : digits,
    ...options,
  }).format(number);
}
