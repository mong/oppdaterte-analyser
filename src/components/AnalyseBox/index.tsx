"use client";

import React from "react";
import classNames from "./AnalyseBox.module.css";
import {
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Popper,
  Fade,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid2";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ClickAwayListener } from "@mui/base";

import { Analyse, Tag, Lang } from "@/types";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { InteractiveChartContainer } from "./InteractiveChartContainer";
import { formatDate } from "@/lib/helpers";

export type AnalyseBoxProps = {
  analyse: Analyse;
  tags: { [k: string]: Tag };
  lang: Lang;
  dict: { [k: string]: string };
  rawHtmlFromMarkdown: { [k: string]: string };
};

export default function AnalyseBox({
  analyse,
  tags,
  lang,
  dict,
  rawHtmlFromMarkdown,
}: AnalyseBoxProps) {
  const years = Object.keys(analyse.data.region["1"]).map(Number);
  years.sort((a, b) => b - a);

  const [expanded, setExpanded] = React.useState(false);

  const [infoAnchor, setInfoAnchor] = React.useState<null | HTMLElement>(null);

  const tagList = (
    <Box className={classNames["tag-container"]}>
      {analyse.tags.map((tag) => (
        <Chip
          label={tags[tag]?.fullname[lang] || tag}
          color={tag in tags ? "primary" : "error"}
          key={tag}
          sx={{ marginRight: "1em" }}
        />
      ))}
    </Box>
  );

  return (
    <Accordion
      disableGutters
      className={classNames["analyse-box"]}
      square={true}
      expanded={expanded}
      sx={{
        borderRadius: { xs: 0, md: "24px" },
        boxShadow: { xs: "0px 3px 10px #AAA", md: "2px 3px 10px #AAA" },
      }}
    >
      <AccordionSummary
        aria-controls={`${analyse.name}-content`}
        id={`${analyse.name}-header`}
        expandIcon={<ArrowDownwardIcon />}
        sx={(theme) => ({
          transition: "background-color .2s ease-in",
          background: `linear-gradient(rgba(0, 0, 0, 0), white)`,
          ":hover": {
            backgroundColor: theme.palette.primary.light,
          },
        })}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ padding: "10px" }}>
          <Typography variant="h4">{analyse.title[lang]}</Typography>
          <Typography variant="body2">
            {dict.updated}: {formatDate(analyse.published, lang)}.
          </Typography>
          <div
            dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.summary }}
          />
          {!expanded && tagList}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <InteractiveChartContainer analyse={analyse} dict={dict} lang={lang} />
        <Box sx={{ padding: 2, paddingTop: 0 }}>
          <div
            dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.discussion }}
          />
          <Grid
            container
            sx={{ justifyContent: "space-between", alignItems: "flex-end" }}
          >
            <Grid size="grow">{tagList}</Grid>
            <Grid>
              <Button
                aria-describedby="info-popper"
                startIcon={<InfoOutlinedIcon />}
                variant={infoAnchor ? "contained" : "outlined"}
                sx={{ borderRadius: "16px", textTransform: "none" }}
                onClick={(event) =>
                  setInfoAnchor(infoAnchor ? null : event.currentTarget)
                }
              >
                {dict.info}
              </Button>

              <Popper
                transition
                id="info-popper"
                open={Boolean(infoAnchor)}
                anchorEl={infoAnchor}
                placement="top-end"
                sx={{
                  margin: "10px",
                  zIndex: 10 /* Ensuring the popper is above MUI InputLabel */,
                }}
                style={{ width: "min(100vw, 800px)" }}
                modifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10],
                    },
                  },
                ]}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={150}>
                    <Paper
                      elevation={10}
                      sx={{ outline: "1px solid rgb(0, 48, 135)" }}
                    >
                      <ClickAwayListener
                        onClickAway={() => setInfoAnchor(null)}
                      >
                        <Box sx={{ padding: { xs: 2, md: 3 } }}>
                          <Box display="flex" alignItems="center">
                            <Box flexGrow={1}>
                              <Typography variant="h4">{dict.info}</Typography>
                            </Box>
                            <Box>
                              <IconButton onClick={() => setInfoAnchor(null)}>
                                <CloseIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: rawHtmlFromMarkdown.info,
                            }}
                          />
                        </Box>
                      </ClickAwayListener>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
