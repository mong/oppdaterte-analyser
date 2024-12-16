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
  Menu,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid2";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ClickAwayListener } from "@mui/base";

import { Analyse, Tag, Lang } from "@/types";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { InteractiveChartContainer } from "./InteractiveChartContainer";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";

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
          sx={{
            marginRight: "1em",
            printColorAdjust: "exact",
            WebkitPrintColorAdjust: "exact",
          }}
        />
      ))}
    </Box>
  );

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
          "& > .MuiAccordionSummary-content": {
            justifyContent: "space-between",
          },
        })}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ padding: "10px" }}>
          <Typography variant="h4">{analyse.title[lang]}</Typography>
          <Typography variant="body2">
            {dict.updated} {formatDate(analyse.published, lang)}.
          </Typography>
          <div
            dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.summary }}
          />
          {!expanded && tagList}
        </Box>
        <Box>
          <IconButton
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
              {dict.open_new_tab}
            </MenuItem>
          </Menu>
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
