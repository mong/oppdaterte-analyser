"use client";

import React from "react";
import classNames from "./AnalyseBox.module.css";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Analyse, Tag, Lang } from "@/types";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { InteractiveChartContainer } from "./InteractiveChartContainer";
import { formatDate, getSubHeader } from "@/lib/helpers";
import Link from "next/link";
import downloadCsv from "@/lib/downloadCsv";
import TagList from "@/components/TagList";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { accordionSummaryClasses } from "@mui/material/AccordionSummary";

export type AnalyseBoxProps = {
  analyse: Analyse;
  tags: { [k: string]: Tag };
  lang: Lang;
  dict: { [k: string]: { [k: string]: string } };
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const bottomGrid = (
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
          {formatDate(analyse.createdAt, lang)}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Accordion
      disableGutters
      className={classNames["analyse-box"]}
      square={true}
      expanded={expanded}
      sx={{
        borderRadius: { xs: 0, md: "16px" },
        boxShadow: { xs: "0px 3px 10px #AAA", md: "2px 3px 10px #AAA" },
        "@media print": {
          margin: 1,
          marginBottom: 4,
          borderRadius: "16px",
        },
      }}
    >
      <AccordionSummary
        aria-controls={`${analyse.name}-content`}
        id={`${analyse.name}-header`}
        sx={(theme) => ({
          transition: "background-color .2s ease-in",
          background: `linear-gradient(rgba(0, 0, 0, 0), white)`,
          ":hover": {
            backgroundColor: theme.palette.primary.light,
          },
          "@media print": {
            background: "none",
          },
        })}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ width: "100%" }}>
          <Grid container sx={{ justifyContent: "space-between" }}>
            <Grid size="grow" sx={{ paddingTop: 1, paddingLeft: 1 }}>
              <Typography variant="h4">{analyse.title[lang]}</Typography>
            </Grid>
            <Grid sx={{ marginBottom: -2 }}>
              <Tooltip title={dict.analysebox.options}>
                <IconButton
                  component="div" /* Fixes hydration error because of "button inside button" */
                  size="large"
                  aria-label="valg"
                  id="long-button"
                  aria-controls={open ? "analyse-meny" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon sx={{ fontSize: "1.8rem" }} />
                </IconButton>
              </Tooltip>
              <Menu
                id="analyse-meny"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  href={`/${lang}/analyse/${analyse.name}`}
                  target="_blank"
                >
                  {dict.analysebox.open_new_tab}
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    downloadCsv(analyse, lang);
                    handleClose(e);
                  }}
                >
                  {dict.analysebox.download_data}
                  {" (CSV)"}
                </MenuItem>
              </Menu>
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
          {!expanded && bottomGrid}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <InteractiveChartContainer analyse={analyse} dict={dict} lang={lang} />
        <Box sx={{ padding: 2, paddingTop: 0 }}>
          <Typography
            variant="body1"
            component="div"
            sx={{ "@media print": { fontSize: "1rem" } }}
            dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.discussion }}
          />
          <Accordion
            elevation={0}
            disableGutters
            sx={{ marginBottom: 1, "&:before": { display: "none" } }}
          >
            <AccordionSummary
              expandIcon={
                <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />
              }
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                flexDirection: "row-reverse",
                [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
                  {
                    transform: "rotate(90deg)",
                  },
              }}
            >
              <Typography sx={{ marginLeft: 1 }} component="span">
                {dict.analysebox.info}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body1"
                component="div"
                dangerouslySetInnerHTML={{
                  __html: rawHtmlFromMarkdown.info,
                }}
              />
            </AccordionDetails>
          </Accordion>

          {bottomGrid}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
