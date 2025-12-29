import { ResultBoxBlock } from "@/blocks/ResultBox/Component";
import { FactBoxBlock } from "@/blocks/FactBox/Component";
import { TableBlock } from "@/blocks/Table/Component";
import { MediaBlock } from '@/blocks/MediaBlock/Component'

import type {
  ResultBoxBlock as ResultBoxBlockProps,
  FactBoxBlock as FactBoxBlockProps,
  MediaBlock as MediaBlockProps,
  TableBlock as TableBlockProps,
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

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
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
    resultBox: ({ node }: { node: SerializedBlockNode<ResultBoxBlockProps> }) => <ResultBoxBlock {...node.fields} />,
    factBox: ({ node }: { node: SerializedBlockNode<FactBoxBlockProps> }) => <FactBoxBlock {...node.fields} />,
    table: ({ node }: { node: SerializedBlockNode<TableBlockProps> }) => <TableBlock {...node.fields} />,
    mediaBlock: ({ node }: { node: SerializedBlockNode<MediaBlockProps> }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
  },
});

type Props = {
  data: DefaultTypedEditorState;
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props;
  return <ConvertRichText converters={jsxConverters} {...rest} />;
}
