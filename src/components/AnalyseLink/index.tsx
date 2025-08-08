import { Analyse, Lang } from "@/types";
import { getTags } from "@/services/mongo";
import { getAnalyseMarkdown } from "@/lib/getMarkdown";
import { Box, Grid, Paper, Typography } from "@mui/material";
import TagList from "../TagList";
import { getSubHeader, makeDateElem } from "@/lib/helpers";

export type AnalyseBoxWrapperProps = {
  analyse: Analyse;
  lang: Lang;
};

export default async function AnalyseBoxWrapper({
  analyse,
  lang,
}: AnalyseBoxWrapperProps) {
  const tags = await getTags(analyse.tags);

  const rawHtmlFromMarkdown = await getAnalyseMarkdown(analyse, lang);
  return (
    <Paper
      sx={{
        padding: 2,
        "&:hover": {
          boxShadow: 3,
          cursor: "pointer",
        },
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Grid container sx={{ justifyContent: "space-between" }}>
          <Grid size="grow" sx={{ paddingTop: 1, paddingLeft: 1 }}>
            <Typography variant="h4">{analyse.title[lang]}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ paddingX: 1, marginTop: 0.5 }}>
          <Typography variant="body1" sx={{ color: "#444" }}>
            {getSubHeader(analyse, lang)}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ width: "100%", "@media print": { fontSize: "1rem" } }}
            dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.summary }}
          />
        </Box>
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-end",
            margin: 1,
          }}
        >
          <Grid size="grow">
            <TagList
              tags={analyse.tags.map((tagName) => tags[tagName] || tagName)}
              lang={lang}
            />
          </Grid>
          <Grid>
            <Typography variant="body2">
              {makeDateElem(analyse.createdAt, lang)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
