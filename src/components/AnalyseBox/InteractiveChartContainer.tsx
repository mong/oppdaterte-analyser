"use client";

import React from "react";
import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  Snackbar,
  Slide,
  Checkbox,
  ListSubheader,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import NumbersIcon from "@mui/icons-material/Numbers";
import JoinFullIcon from "@mui/icons-material/JoinFull";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PublicIcon from "@mui/icons-material/Public";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

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
  const [timelineVar, setTimelineVar] = React.useState<[number, number]>([
    0, 0,
  ]);
  const [showNorway, setShowNorway] = React.useState(false);

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

  const maxValues = React.useMemo(() => {
    const calculateMaxValue = (view_index: number, var_index: number) =>
      Math.max(
        ...Object.keys(analyse.data[level])
          .filter((area) => showNorway || area !== "8888")
          .map((area) =>
            Math.max(
              ...Object.keys(analyse.data[level][area]).map(
                (year) =>
                  analyse.data[level][area][year][view_index][var_index],
              ),
            ),
          ),
      );
    return Object.fromEntries(
      analyse.views
        .flatMap((view, i) =>
          view.variables.map((_, j) => [`${i},${j}`, calculateMaxValue(i, j)]),
        )
        .concat([["0,1", calculateMaxValue(0, 1)]]),
    );
  }, [analyse, level, showNorway]);

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
                      <BarChartIcon sx={{ marginRight: 1 }} color="primary" />
                    </Grid>
                    <Grid>{view.title[lang]}</Grid>
                  </Grid>
                </MenuItem>
              ))}
              <MenuItem value={"tidstrend"}>
                <Grid container alignItems="center">
                  <Grid display="flex">
                    <InsightsIcon sx={{ marginRight: 1 }} color="primary" />
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
              <MenuItem value={"sykehus"}>
                <Grid container alignItems="center" wrap="nowrap">
                  <Grid display="flex">
                    <LocalHospitalIcon
                      sx={{ marginRight: 1 }}
                      color="primary"
                    />
                  </Grid>
                  <Grid>{dict.analysebox.sykehus}</Grid>
                </Grid>
              </MenuItem>
              <MenuItem value={"region"}>
                <Grid container alignItems="center" wrap="nowrap">
                  <Grid display="flex">
                    <PublicIcon sx={{ marginRight: 1 }} color="primary" />
                  </Grid>
                  <Grid>{dict.analysebox.region}</Grid>
                </Grid>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {view === "tidstrend" ? (
          <Grid
            size={{ xs: 12, sm: 4 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth>
              <InputLabel id="select-variable-label">
                {dict.analysebox.variable_select}
              </InputLabel>
              <Select
                labelId="select-variable-label"
                id="select-variable"
                value={String(timelineVar)}
                label={dict.analysebox.variable_select}
                onChange={(e) =>
                  setTimelineVar(
                    e.target.value.split(",").map(Number) as [number, number],
                  )
                }
              >
                <MenuItem value={"0,0"}>
                  <Grid container alignItems="center" wrap="nowrap">
                    <Grid display="flex">
                      <JoinFullIcon sx={{ marginRight: 1 }} color="primary" />
                    </Grid>
                    <Grid>Total</Grid>
                  </Grid>
                </MenuItem>
                <MenuItem value={"0,1"}>
                  <Grid container alignItems="center" wrap="nowrap">
                    <Grid display="flex">
                      <NumbersIcon sx={{ marginRight: 1 }} color="primary" />
                    </Grid>
                    <Grid>{dict.analysebox.number_variable}</Grid>
                  </Grid>
                </MenuItem>
                {analyse.views.map((view, i) =>
                  i === 0
                    ? []
                    : [
                        <ListSubheader key={i}>
                          {view.title[lang]}
                        </ListSubheader>,
                      ].concat(
                        view.variables.map((variable, j) => (
                          <MenuItem value={`${i},${j}`} key={`${i}_${j}`}>
                            <Grid container alignItems="center" wrap="nowrap">
                              <Grid display="flex">
                                <ZoomInIcon
                                  sx={{ marginRight: 1 }}
                                  color="primary"
                                />
                              </Grid>
                              <Grid>{variable[lang]}</Grid>
                            </Grid>
                          </MenuItem>
                        )),
                      ),
                )}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <Grid
            size={{ xs: 12, sm: 4 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl fullWidth>
              <InputLabel id="select-year-label">
                {dict.analysebox.year_select}
              </InputLabel>
              <Select
                labelId="select-year-label"
                id="select-year"
                value={year.toString()}
                label={dict.analysebox.year_select}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <MenuItem key={y.toString()} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
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
              displayPrint: "none",
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

        <Box
          ref={graphRef}
          sx={{
            width: "100%",
            height: "80vw",
            maxHeight: "700px",
            minHeight: "370px",
            marginTop: 0,
            position: "sticky",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
            }}
          >
            <Box
              component="img"
              alt="SKDE Logo."
              src="/img/logo-skde-graa.svg"
              sx={{
                width: "15vw",
                maxWidth: 125,
                position: "absolute",
                bottom: 40,
                right: 30,
                printColorAdjust: "exact",
                "@media print": { bottom: 70 },
              }}
            />
          </Box>
          {view === "tidstrend" ? (
            <AnalyseLineChart
              analyse={analyse}
              years={years}
              level={level}
              variable={timelineVar}
              showNorway={showNorway}
              selection={selection}
              lang={lang}
              maxValue={maxValues[String(timelineVar)]}
            />
          ) : (
            <AnalyseBarChart
              analyse={analyse}
              year={year}
              level={level}
              view={view}
              lang={lang}
              maxValue={maxValues["0,0"]}
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
        </Box>

        <Box
          sx={{
            textAlign: "center",
            padding: 1,
            paddingBottom: 2,
            "@media print": { padding: 0 },
          }}
        >
          {view !== "tidstrend" || String(timelineVar) === "0,0" ? (
            <Typography variant="body2">{analyse.description[lang]}</Typography>
          ) : view === "tidstrend" && String(timelineVar) === "0,1" ? (
            <>
              <Typography variant="body2" sx={{ display: "inline" }}>
                {dict.analysebox.absolute_number}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    sx={{ marginLeft: 2 }}
                    checked={showNorway}
                    onChange={() => setShowNorway(!showNorway)}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ display: "inline" }}>
                    {dict.analysebox.show_norway}
                  </Typography>
                }
              />
            </>
          ) : (
            <Typography variant="body2">
              {analyse.description[lang]}
              {": "}
              <i>
                {analyse.views[timelineVar[0]].variables[timelineVar[1]][lang]}
              </i>
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ padding: 2, paddingY: 0, displayPrint: "none" }}>
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
