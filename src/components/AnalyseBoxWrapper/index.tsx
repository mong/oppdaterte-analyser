import { Lang } from "@/types";
import AnalyseBox from "../AnalyseBox";
import { getDictionary } from "@/lib/dictionaries";
import { getAnalyse, getTags } from "@/services/mongo";
import getAnalyseMarkdown from "@/lib/getAnalyseMarkdown";

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

  return (
    <AnalyseBox
      analyse={analyse}
      tags={tags}
      lang={lang}
      dict={dict.analysebox}
      rawHtmlFromMarkdown={await getAnalyseMarkdown(analyse, lang)}
    />
  );
}
