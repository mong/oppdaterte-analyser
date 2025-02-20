import { Analyse, Lang } from "@/types";
import AnalyseBox from "../AnalyseBox";
import { getDictionary } from "@/lib/dictionaries";
import { getTags } from "@/services/mongo";
import { getAnalyseMarkdown } from "@/lib/getMarkdown";

export type AnalyseBoxWrapperProps = {
  analyse: Analyse;
  lang: Lang;
};

export default async function AnalyseBoxWrapper({
  analyse,
  lang,
}: AnalyseBoxWrapperProps) {
  const dict = await getDictionary(lang);
  const tags = await getTags(analyse.tags);
  return (
    <AnalyseBox
      analyse={analyse}
      tags={tags}
      lang={lang}
      dict={dict}
      rawHtmlFromMarkdown={await getAnalyseMarkdown(analyse, lang)}
    />
  );
}
