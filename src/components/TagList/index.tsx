import { Lang } from "@/types";
import { Tag as TagType } from "@/payload-types";

import { Tag } from "@mong/material-ui";

type TagListProps = {
  tags: TagType[];
  lang: Lang;
};

export default function TagList({ tags, lang }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {tags.map((tag) => (
        <Tag
          key={tag.identifier}
          label={tag.title}
          href={`/${lang}/fag/${tag.identifier}`}
        />
      ))}
    </div>
  );
}
