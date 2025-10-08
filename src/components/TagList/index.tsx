"use client";

import { Lang } from "@/types";
import { Tag } from "@/payload-types";
import { Box, Chip, Link } from "@mui/material";

type TagListProps = {
  tags: (Tag | string)[];
  lang: Lang;
};

export default function TagList({ tags, lang }: TagListProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        rowGap: "10px",
        marginTop: "8px",
      }}
    >
      {tags.map((tag, i) => (
        <Chip
          clickable
          component={Link}
          href={`/${lang}/${typeof tag === "string" ? tag : tag.identifier}/`}
          target="_blank"
          onClick={(event) => event.stopPropagation()}
          label={typeof tag === "string" ? tag : tag.title}
          color={typeof tag === "string" ? "error" : "primary"}
          key={i}
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
