import { ResultBoxBlock } from "@/blocks/ResultBox/Component";
import { FactBoxBlock } from "@/blocks/FactBox/Component";
import { TableBlock } from "@/blocks/Table/Component";
import { MediaBlock } from '@/blocks/MediaBlock/Component';
import { RawHTMLBlock } from "@/blocks/RawHTML/Component";

import type {
  ResultBoxBlock as ResultBoxBlockProps,
  FactBoxBlock as FactBoxBlockProps,
  MediaBlock as MediaBlockProps,
  TableBlock as TableBlockProps,
  RawHTMLBlock as RawHTMLBlockProps,
} from 'src/payload-types'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from "@payloadcms/richtext-lexical";
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from "@payloadcms/richtext-lexical/react";
import { Suspense } from "react";
import { Grid, CircularProgress } from "@mui/material";

type NodeTypes = DefaultNodeTypes | SerializedBlockNode;

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!;
  if (typeof value !== "object") {
    throw new Error("Expected value to be an object");
  }

  switch (relationTo) {
    case "media":
    case "datafiler":
      return value.url as string;
    default:
      return `/${value.slug}`;
  }

};

const jsxConverters: (lang: "en" | "nb" | "nn", author: "SKDE" | "Helse Førde") =>
  JSXConvertersFunction<NodeTypes> = (lang, author) => ({
    defaultConverters,
  }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    heading: ({ node, nodesToJSX }) => {
      const text = nodesToJSX({ nodes: node.children })
      const id = text.join("").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const Tag = node.tag;
      return <Tag id={id}>{text}</Tag>;
    },
    blocks: {
      resultBox: ({ node }: { node: SerializedBlockNode<ResultBoxBlockProps> }) =>
        <Suspense
          fallback={
            <Grid container justifyContent="center" sx={{ padding: 10 }}>
              <CircularProgress />
            </Grid>
          }
        >
          <ResultBoxBlock lang={lang} author={author} {...node.fields} />
        </Suspense>,
      factBox: ({ node }: { node: SerializedBlockNode<FactBoxBlockProps> }) => <FactBoxBlock {...node.fields} />,
      table: ({ node }: { node: SerializedBlockNode<TableBlockProps> }) => <TableBlock {...node.fields} />,
      rawHTML: ({ node }: { node: SerializedBlockNode<RawHTMLBlockProps> }) => <RawHTMLBlock {...node.fields} />,
      mediaBlock: ({ node }: { node: SerializedBlockNode<MediaBlockProps> }) => (
        <MediaBlock
          imgClassName="m-0"
          {...node.fields}
          enableGutter={false}
        />
      ),
    },
  });

type Props = {
  data: DefaultTypedEditorState;
  lang?: "en" | "nb" | "nn";
  author?: "SKDE" | "Helse Førde";
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, author = "SKDE", lang = "nb", ...rest } = props;
  return <ConvertRichText converters={jsxConverters(lang, author)} {...rest} />;
}
