import { Analyse, Lang } from "@/types";
import { remark } from "remark";
import html from "remark-html";

async function markdownToHtml(markdown: string): Promise<string> {
  const text = await remark().use(html).process(markdown);
  return text.toString();
}

export default async function getAnalyseMarkdown(
  analyse: Analyse,
  lang: Lang,
): Promise<{ [k: string]: string }> {
  return {
    summary: await markdownToHtml(analyse.summary[lang]),
    discussion: await markdownToHtml(analyse.discussion[lang]),
    info: await markdownToHtml(analyse.info[lang]),
  };
}
