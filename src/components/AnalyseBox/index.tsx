"use client";

import React from "react";
import classNames from "./AnalyseBox.module.css";
import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Analyse, Tag, Lang, View } from "@/types";
import { AnalyseBarChart } from "./AnalyseBarChart";
import { AnalyseLineChart } from "./AnalyseLineChart";

import { regions_dict, hospitalStructure, Selection } from "@/lib/nameMapping";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AreaPicker from "@/components/AreaPicker";

export const getViewMetadata = (views: View[]) => {
  const defaultData: { [k: string]: View } = {
    total: {
      name: "total",
      title: { no: "Enkeltår", en: "Single year" },
      variables: [{ no: "Total", en: "Total" }],
    },
    off_priv: {
      name: "off_priv",
      title: {
        no: "Enkeltår, offentlig/privat",
        en: "Single year, public/private",
      },
      variables: [
        { no: "Offentlig", en: "Public" },
        { no: "Privat", en: "Private" },
      ],
    },
  };

  if (views[0].name !== "total") {
    throw new Error(
      "Incorrect view order in datafile; the first view should be a total",
    );
  }

  const mergedData = views.map(
    (view) =>
      ({
        ...view,
        ...defaultData[view.name],
      }) as View,
  );

  return {
    viewOrder: mergedData.map((view) => view.name),
    viewLookup: Object.fromEntries(mergedData.map((view) => [view.name, view])),
  };
};

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

  const { viewOrder, viewLookup } = getViewMetadata(analyse.views);

  const [year, setYear] = React.useState(Math.max(...years));
  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");
  const [view, setView] = React.useState<"tidstrend" | number>(0);

  const [selection, setSelection] = React.useState(
    new Selection({ region: [], sykehus: [] }),
  );

  const [expanded, setExpanded] = React.useState(false);

  const theme = useTheme();

  const tagList = (
    <Box className={classNames["tag-container"]}>
      {analyse.tags.map((tag) => (
        <Chip
          label={tags[tag].fullname[lang]}
          color="primary"
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
        sx={{
          transition: "background-color .2s ease-in",
          background: `linear-gradient(rgba(0, 0, 0, 0), white)`,
          ":hover": {
            backgroundColor: theme.palette.surface2.light,
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ padding: "10px" }}>
          <Typography variant="h3">{analyse.title[lang]}</Typography>
          <Typography variant="body2">
            Oppdatert: {new Date(analyse.published).toUTCString()}
          </Typography>
          <div
            dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.summary }}
          />
          {!expanded && tagList}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Grid container spacing={2} sx={{ padding: 2, paddingBottom: 1 }}>
          <Grid
            size={{ xs: 12, sm: 4 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth>
              <InputLabel id="select-level-label">
                {dict.area_select}
              </InputLabel>
              <Select
                labelId="select-level-label"
                id="select-level"
                value={level}
                label={dict.area_select}
                onChange={(e) =>
                  setLevel(e.target.value as "sykehus" | "region")
                }
              >
                <MenuItem value={"sykehus"}>{dict.sykehus}</MenuItem>
                <MenuItem value={"region"}>{dict.region}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid
            size={{ xs: 12, sm: 4 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth>
              <InputLabel id="select-view-label">{dict.view_select}</InputLabel>
              <Select
                labelId="select-view-label"
                id="select-view"
                value={view}
                label={dict.view_select}
                onChange={(e) =>
                  setView(
                    e.target.value === "tidstrend"
                      ? "tidstrend"
                      : Number(e.target.value),
                  )
                }
              >
                {viewOrder.map((view, i) => (
                  <MenuItem key={i} value={i}>
                    {viewLookup[view].title[lang]}
                  </MenuItem>
                ))}
                <MenuItem value={"tidstrend"}>{dict.time_series}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 4 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth disabled={view === "tidstrend"}>
              <InputLabel id="select-year-label">{dict.year_select}</InputLabel>
              <Select
                labelId="select-year-label"
                id="select-year"
                value={view === "tidstrend" ? "-" : year.toString()}
                label={dict.year_select}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <MenuItem key={y.toString()} value={y}>
                    {y}
                  </MenuItem>
                ))}
                {view === "tidstrend" && (
                  <MenuItem value={"-"}>{dict.all_years_shown}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Paper elevation={0} className={classNames["chart-container"]}>
          {view === "tidstrend" ? (
            <AnalyseLineChart
              analyse={analyse}
              dict={dict}
              years={years}
              level={level}
              selection={selection}
              lang={lang}
            />
          ) : (
            <AnalyseBarChart
              analyse={analyse}
              year={year}
              level={level}
              view={view}
              lang={lang}
              selection={selection}
              onClick={(area) => {
                if (area !== 8888)
                  setSelection(
                    level === "region"
                      ? selection.toggleRegion(area)
                      : selection.toggleSykehus(area),
                  );
              }}
            />
          )}
        </Paper>
        <Box sx={{ padding: 2, paddingTop: 0 }}>
          <AreaPicker
            dict={dict}
            selection={selection}
            lang={lang}
            onRegionChange={(region) =>
              setSelection(selection.toggleRegion(region))
            }
            onSykehusChange={(sykehus) =>
              setSelection(selection.toggleSykehus(sykehus))
            }
          />
          <div
            dangerouslySetInnerHTML={{ __html: rawHtmlFromMarkdown.discussion }}
          />
          {tagList}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
