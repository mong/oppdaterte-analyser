import { Analyse, Lang } from "@/types";
import { remark } from "remark";
import html from "remark-html";
import strip from "strip-markdown";

export async function markdownToHtml(markdown: string): Promise<string> {
  const text = await remark().use(html).process(markdown);
  return text.toString();
}

export async function stripMarkdown(markdown: string): Promise<string> {
  return (await remark().use(strip).process(markdown)).toString();
}

export async function getAnalyseMarkdown(
  analyse: Analyse,
  lang: Lang,
): Promise<{ [k: string]: string }> {
  return {
    summary: await markdownToHtml(analyse.summary[lang]),
    discussion: await markdownToHtml(analyse.discussion[lang]),
    info: await markdownToHtml(analyse.info[lang]),
  };
}
