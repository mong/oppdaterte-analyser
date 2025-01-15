import { Analyse, Lang, Tag } from "@/types";
import { Box, Chip } from "@mui/material";

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
