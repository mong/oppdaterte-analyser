"use client";

import { Lang } from "@/types";
import { Tag } from "@/payload-types";

import {
  TagButton
} from "@mong/material-ui";

type TagListProps = {
  tags: Tag[];
  lang: Lang;
};

export default function TagList({ tags, lang }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {tags.map((tag) => (
        <TagButton
          key={tag.identifier}
          label={tag.title}
          onClick={() => { 
            window.location.href = `/${lang}/fag/${tag.identifier}`;
          }}
        />
      ))}
    </div>
  );
}
