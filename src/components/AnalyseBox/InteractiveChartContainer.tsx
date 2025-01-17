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
  IconButton,
  Tooltip,
  Menu,
  Snackbar,
  Slide,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";

import { Analyse, Lang } from "@/types";
import { AnalyseBarChart } from "./AnalyseBarChart";
import { AnalyseLineChart } from "./AnalyseLineChart";

import { Selection } from "@/lib/nameMapping";
import AreaPicker from "@/components/AreaPicker";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

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
  if (analyse.views[0].name !== "total") {
    throw new Error(
      "Incorrect view order in datafile; the first view should be a total",
    );
  }
  const years = Object.keys(analyse.data.region["1"]).map(Number);
  years.sort((a, b) => b - a);

  const [year, setYear] = React.useState(Math.max(...years));
  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");
  const [view, setView] = React.useState<"tidstrend" | number>(0);
  const graphRef = React.useRef<null | HTMLDivElement>(null);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

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

  const getCanvas = async () => {
    if (graphRef.current) {
      return await html2canvas(graphRef.current, {
        onclone: (_, elem) => {
          Array.from(elem.querySelectorAll("*")).forEach((e) => {
            let existingStyle = e.getAttribute("style") || "";
            e.setAttribute(
              "style",
              `${existingStyle}; font-family: sans-serif`,
            );
          });
        },
      });
    }
    return Promise.reject(new Error("No ref to graph"));
  };
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
              {analyse.views.map((view, i) => (
                <MenuItem key={i} value={i}>
                  <Grid container alignItems="center" wrap="nowrap">
                    <Grid display="flex">
                      <BarChartIcon
                        sx={{ marginRight: 1 }}
                        fontSize={"small"}
                        color="primary"
                      />
                    </Grid>
                    <Grid>{view.title[lang]}</Grid>
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
      </Grid>

      <Box sx={{ position: "sticky" }}>
        <Tooltip title={dict.analysebox.copy_graph_tooltip}>
          <IconButton
            aria-label="screenshot"
            size="large"
            sx={{
              position: "absolute",
              right: 10,
              top: 10,
              zIndex: 2,
              color: "rgba(0, 0, 0, 0.2)",
              "&:hover": { color: "rgba(0, 0, 0, 0.6)" },
            }}
            aria-controls={open ? "screenshot-meny" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <PhotoCameraIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="screenshot-meny"
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={(e) => {
              getCanvas().then((canvas) =>
                canvas.toBlob(
                  (blob) =>
                    blob &&
                    navigator.clipboard
                      .write([
                        new ClipboardItem({
                          "image/png": blob,
                        }),
                      ])
                      .then(() => setOpenSnackbar(true)),
                ),
              );
              handleClose(e);
            }}
          >
            {dict.analysebox.copy_graph}
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              const filename =
                view === "tidstrend"
                  ? `${analyse.name}_tidstrend.png`
                  : `${analyse.name}_${analyse.views[view].title[lang].toLowerCase().replace(" ", "_")}_${year}.png`;

              getCanvas().then((canvas) =>
                canvas.toBlob((blob) => blob && saveAs(blob, filename)),
              );
              handleClose(e);
            }}
          >
            {dict.analysebox.download_graph}
          </MenuItem>
        </Menu>

        <Box ref={graphRef}>
          <Paper
            elevation={0}
            className={classNames["chart-container"]}
            sx={{
              backgroundImage: "url('/img/logo-skde-graa.svg')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "min(max(60px, 10vw), 120px)",
              backgroundPositionX: "95%",
              backgroundPositionY: "93%",
            }}
          >
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
        </Box>

        <Box sx={{ textAlign: "center", padding: 1, paddingBottom: 2 }}>
          <Typography variant="body2">{analyse.description[lang]}</Typography>
        </Box>
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        TransitionComponent={Slide}
        message={dict.analysebox.copy_graph_snackbar_message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenSnackbar(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
