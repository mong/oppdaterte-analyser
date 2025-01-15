"use client";

import React from "react";
import classNames from "./AnalyseBox.module.css";
import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";

import { Analyse, Lang, View } from "@/types";
import { AnalyseBarChart } from "./AnalyseBarChart";
import { AnalyseLineChart } from "./AnalyseLineChart";

import { Selection } from "@/lib/nameMapping";
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

export type InteractiveChartContainerProps = {
  analyse: Analyse;
  lang: Lang;
  dict: { [k: string]: { [k: string]: string } };
};

export function InteractiveChartContainer({
  analyse,
  lang,
  dict,
}: InteractiveChartContainerProps) {
  const years = Object.keys(analyse.data.region["1"]).map(Number);
  years.sort((a, b) => b - a);

  const { viewOrder, viewLookup } = getViewMetadata(analyse.views);

  const [year, setYear] = React.useState(Math.max(...years));
  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");
  const [view, setView] = React.useState<"tidstrend" | number>(0);

  const [selection, setSelection] = React.useState(
    new Selection({ region: [], sykehus: [] }),
  );

  const maxValue = React.useMemo(
    () =>
      Math.max(
        ...Object.keys(analyse.data[level]).map((area) =>
          Math.max(
            ...Object.keys(analyse.data[level][area]).map(
              (year) => analyse.data[level][area][year][0][0],
            ),
          ),
        ),
      ),
    [analyse, level],
  );

  return (
    <Box>
      <Grid container spacing={2} sx={{ padding: 2, paddingBottom: 1 }}>
        <Grid
          size={{ xs: 12, sm: 4 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <FormControl fullWidth>
            <InputLabel id="select-level-label">
              {dict.analysebox.area_select}
            </InputLabel>
            <Select
              labelId="select-level-label"
              id="select-level"
              value={level}
              label={dict.analysebox.area_select}
              onChange={(e) => setLevel(e.target.value as "sykehus" | "region")}
            >
              <MenuItem value={"sykehus"}>{dict.analysebox.sykehus}</MenuItem>
              <MenuItem value={"region"}>{dict.analysebox.region}</MenuItem>
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
            <InputLabel id="select-view-label">
              {dict.analysebox.view_select}
            </InputLabel>
            <Select
              labelId="select-view-label"
              id="select-view"
              value={view}
              label={dict.analysebox.view_select}
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
                  <Grid container alignItems="center">
                    <Grid display="flex">
                      <BarChartIcon
                        sx={{ marginRight: 1 }}
                        fontSize={"small"}
                        color="primary"
                      />
                    </Grid>
                    <Grid>{viewLookup[view].title[lang]}</Grid>
                  </Grid>
                </MenuItem>
              ))}
              <MenuItem value={"tidstrend"}>
                <Grid container alignItems="center">
                  <Grid display="flex">
                    <InsightsIcon
                      sx={{ marginRight: 1 }}
                      fontSize={"small"}
                      color="primary"
                    />
                  </Grid>
                  <Grid>{dict.analysebox.time_series}</Grid>
                </Grid>
              </MenuItem>
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
            <InputLabel id="select-year-label">
              {dict.analysebox.year_select}
            </InputLabel>
            <Select
              labelId="select-year-label"
              id="select-year"
              value={view === "tidstrend" ? "-" : year.toString()}
              label={dict.analysebox.year_select}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <MenuItem key={y.toString()} value={y}>
                  {y}
                </MenuItem>
              ))}
              {view === "tidstrend" && (
                <MenuItem value={"-"}>
                  {dict.analysebox.all_years_shown}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Paper elevation={0} className={classNames["chart-container"]}>
        {view === "tidstrend" ? (
          <AnalyseLineChart
            analyse={analyse}
            years={years}
            level={level}
            selection={selection}
            lang={lang}
            maxValue={maxValue}
          />
        ) : (
          <AnalyseBarChart
            analyse={analyse}
            year={year}
            level={level}
            view={view}
            lang={lang}
            maxValue={maxValue}
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
      <Box sx={{ textAlign: "center", padding: 1, paddingBottom: 2 }}>
        <Typography variant="body2">{analyse.description[lang]}</Typography>
      </Box>
      <Box sx={{ padding: 2, paddingY: 0 }}>
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
      </Box>
    </Box>
  );
}
