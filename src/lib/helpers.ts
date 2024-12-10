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
  return new Intl.NumberFormat(lang, {
    maximumFractionDigits:
      options?.style === "percent"
        ? Number(number < 0.1)
        : 1 + Number(number < 5) + Number(number < 0.5),
    ...options,
  }).format(number);
}
