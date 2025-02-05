"use client";

import { Analyse, Lang, Tag } from "@/types";
import { Box, Chip } from "@mui/material";
import Link from "next/link";

type TagListProps = {
  analyse: Analyse;
  tags: { [k: string]: Tag };
  lang: Lang;
};

export default function TagList({ analyse, tags, lang }: TagListProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        rowGap: "10px",
        marginTop: "8px",
      }}
    >
      {analyse.tags.map((tag) => (
        <Chip
          clickable
          component={Link}
          href={`/${lang}/${tag}/`}
          target="_blank"
          onClick={(event) => event.stopPropagation()}
          label={tags[tag]?.fullname[lang] || tag}
          color={tag in tags ? "primary" : "error"}
          key={tag}
          sx={{
            marginRight: "1em",
            printColorAdjust: "exact",
            WebkitPrintColorAdjust: "exact",
          }}
        />
      ))}
    </Box>
  );
}
