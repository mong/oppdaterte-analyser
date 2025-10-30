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
