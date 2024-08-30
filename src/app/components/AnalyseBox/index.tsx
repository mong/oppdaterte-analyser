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
import Grid from "@mui/material/Unstable_Grid2";
import { useTranslations } from "next-intl";

import { Analyse } from "@/app/models/AnalyseModel";
import { AnalyseBarChart } from "./AnalyseBarChart";
import { AnalyseLineChart } from "./AnalyseLineChart";
import { Tag } from "@/app/models/TagModel";

export type AnalyseBoxProps = {
  analyse: Analyse;
  tags: { [k: string]: Tag };
  lang: string;
};

export default function AnalyseBox({ analyse, tags, lang }: AnalyseBoxProps) {
  const t = useTranslations("AnalyseBox");
  const years = Object.keys(analyse.data.region["1"]).map(Number);
  years.sort((a, b) => b - a);

  const [year, setYear] = React.useState(Math.max(...years));
  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");
  const [visning, setVisning] = React.useState<"barchart" | "tidstrend">(
    "barchart",
  );
  const [view, setView] = React.useState(analyse.views[0]);
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
        overflow: "clip",
      }}
    >
      <AccordionSummary
        aria-controls={`${analyse.name}-content`}
        id={`${analyse.name}-header`}
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
            {t("updated")}: {new Date(analyse.published).toLocaleString(lang)}
          </Typography>
          <ul>
            <li>
              <Typography>{analyse.description[lang]}</Typography>
            </li>
            <li>
              <Typography>{t("conclusion")}</Typography>
            </li>
            <li>
              <Typography>{t("recommendation")}</Typography>
            </li>
          </ul>

          {!expanded && tagList}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid
            xs={12}
            sm={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth>
              <InputLabel id="select-level-label">
                {t("geographicArea")}
              </InputLabel>
              <Select
                labelId="select-level-label"
                id="select-level"
                value={level}
                label={t("geographicArea")}
                onChange={(e) =>
                  setLevel(e.target.value as "sykehus" | "region")
                }
              >
                <MenuItem value={"region"}>{t("region")}</MenuItem>
                <MenuItem value={"sykehus"}>{t("hospital")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid
            xs={12}
            sm={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth>
              <InputLabel id="select-visning-label">Visning</InputLabel>
              <Select
                labelId="select-visning-label"
                id="select-visning"
                value={visning}
                label="Visning"
                onChange={(e) =>
                  setVisning(e.target.value as "barchart" | "tidstrend")
                }
              >
                <MenuItem value={"barchart"}>Enkeltår</MenuItem>
                <MenuItem value={"tidstrend"}>Tidstrend</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            sm={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth disabled={visning === "tidstrend"}>
              <InputLabel id="select-year-label">Velg år</InputLabel>
              <Select
                labelId="select-year-label"
                id="select-year"
                value={visning === "tidstrend" ? "-" : year.toString()}
                label="Velg år"
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <MenuItem key={y.toString()} value={y}>
                    {y}
                  </MenuItem>
                ))}
                {visning === "tidstrend" && (
                  <MenuItem value={"-"}>Alle år vises</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Paper elevation={0} className={classNames["chart-container"]}>
          {visning === "barchart" ? (
            <AnalyseBarChart
              analyse={analyse}
              year={year}
              level={level}
              view={view}
            />
          ) : (
            <AnalyseLineChart
              analyse={analyse}
              years={years}
              level={level}
              view={view}
            />
          )}
        </Paper>
        <br />
        <Typography>{t("loremIpsum1")}</Typography>
        <br />
        <Typography>{t("loremIpsum2")}</Typography>
        {tagList}
      </AccordionDetails>
    </Accordion>
  );
}
