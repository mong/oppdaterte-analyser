"use client";

import { Lang, Tag } from "@/types";
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
          href={`/${lang}/${typeof tag === "string" ? tag : tag.name}/`}
          target="_blank"
          onClick={(event) => event.stopPropagation()}
          label={typeof tag === "string" ? tag : tag.fullname[lang]}
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
