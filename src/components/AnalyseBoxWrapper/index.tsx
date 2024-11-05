import { Lang } from "@/types";
import AnalyseBox from "../AnalyseBox";
import { getDictionary } from "@/lib/dictionaries";
import { getAnalyse, getTags } from "@/services/mongo";

import { remark } from "remark";
import html from "remark-html";

async function markdownToHtml(markdown: string): Promise<string> {
  const text = await remark().use(html).process(markdown);
  return text.toString();
}

export type AnalyseBoxWrapperProps = {
  analyseName: string;
  lang: Lang;
};

export default async function AnalyseBoxWrapper({
  analyseName,
  lang,
}: AnalyseBoxWrapperProps) {
  const dict = await getDictionary(lang);
  const analyse = await getAnalyse(analyseName);
  const tags = await getTags(analyse.tags);

  const htmlSummary = await markdownToHtml(analyse.summary[lang]);
  const htmlDiscussion = await markdownToHtml(analyse.discussion[lang]);
  const info = await markdownToHtml(analyse.info[lang]);
  const rawHtmlFromMarkdown = {
    summary: htmlSummary,
    discussion: htmlDiscussion,
    info: info,
  };

  return (
    <AnalyseBox
      analyse={analyse}
      tags={tags}
      lang={lang}
      dict={dict.analysebox}
      rawHtmlFromMarkdown={rawHtmlFromMarkdown}
    />
  );
}
