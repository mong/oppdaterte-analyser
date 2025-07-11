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
  ListSubheader,
  FormControlLabel,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Button,
  Zoom,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import NumbersIcon from "@mui/icons-material/Numbers";
import JoinFullIcon from "@mui/icons-material/JoinFull";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PublicIcon from "@mui/icons-material/Public";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import GroupsIcon from "@mui/icons-material/Groups";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { Analyse, Lang, View } from "@/types";
import { AnalyseBarChart } from "./AnalyseBarChart";
import { AnalyseLineChart } from "./AnalyseLineChart";

import { Selection } from "@/lib/nameMapping";
import AreaPicker from "@/components/AreaPicker";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { getDescription } from "@/lib/helpers";
import AnalyseDemography from "./AnalyseDemography";

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

  const lastYear = Math.max(...years);
  const [year, setYear] = React.useState<number | "all_years">(lastYear);
  const [variable, setVariable] = React.useState<[string, number]>([
    "total",
    0,
  ]);
  const [showNorway, setShowNorway] = React.useState(false);
  const [showGenders, setShowGenders] = React.useState(true);
  const [demographyAndel, setDemographyAndel] = React.useState(false);

  const [yearSelector, setYearSelector] = React.useState(false);

  const [animating, setAnimating] = React.useState(false);
  const animatingRef = React.useRef(false);
  React.useEffect(() => {
    animatingRef.current = animating;
  }, [animating]);

  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");
  const [view, setView] = React.useState("total");
  const graphRef = React.useRef<null | HTMLDivElement>(null);

  const currentView = analyse.views.find((v) => v.name === view);
  // ^ currentView is undefined if view is "tidstrend"

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
    const calculateMaxValue = (viewName: string, var_index: number) =>
      Math.max(
        ...Object.keys(analyse.data[level])
          .filter((area) => showNorway || area !== "8888")
          .map((area) =>
            Math.max(
              ...years.map(
                (year) => analyse.data[level][area][year][viewName][var_index],
              ),
            ),
          ),
      );
    const mapping = Object.fromEntries(
      analyse.views.map((view, i) => [
        view.name,
        view.variables.map((_, j) => calculateMaxValue(view.name, j)),
      ]),
    );
    mapping["total"].push(calculateMaxValue("total", 1));
    return mapping;
  }, [analyse, level, showNorway]);

  const demographyAvailable = !analyse.demografi
    ? {}
    : Object.fromEntries(
        Object.keys(analyse.demografi[lastYear][analyse.age_range[0]])
          .filter((v) => v !== "population")
          .map((v) => [v, true]),
      );

  return (
    <Box>
      <Grid container spacing={2} sx={{ padding: 2, paddingBottom: 1 }}>
        <Grid
          size={{ xs: 12, md: 4 }}
          display="flex"
          sx={{ height: "3.75rem" }}
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
              onChange={(e) => {
                if (e.target.value === "demografi") {
                  setYear("all_years");
                  if (
                    String(variable) === "total,1" ||
                    !demographyAvailable[variable[0]]
                  )
                    setVariable(["total", 0]);
                } else if (year === "all_years") setYear(lastYear);
                setView(e.target.value);
              }}
            >
              {analyse.views.map((view, i) => (
                <MenuItem key={i} value={view.name}>
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
              {analyse.demografi && (
                <MenuItem value={"demografi"}>
                  <Grid container alignItems="center">
                    <Grid display="flex">
                      <GroupsIcon sx={{ marginRight: 1 }} color="primary" />
                    </Grid>
                    <Grid>{dict.analysebox.demography}</Grid>
                  </Grid>
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        {view !== "demografi" && (
          <Grid
            size={{ xs: 12, md: 4 }}
            display="flex"
            sx={{ height: "3.75rem" }}
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
                onChange={(e) =>
                  setLevel(e.target.value as "sykehus" | "region")
                }
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
        )}

        {["tidstrend", "demografi"].includes(view) && (
          <Grid
            size={{ xs: 12, md: 4 }}
            display="flex"
            sx={{ height: "3.75rem" }}
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
                value={String(variable)}
                label={dict.analysebox.variable_select}
                onChange={(e) => {
                  const [viewName, variable] = e.target.value.split(",");
                  setVariable([viewName, Number(variable)]);
                }}
              >
                <MenuItem value={"total,0"}>
                  <Grid container alignItems="center" wrap="nowrap">
                    <Grid display="flex">
                      <JoinFullIcon sx={{ marginRight: 1 }} color="primary" />
                    </Grid>
                    <Grid>
                      {
                        dict.analysebox[
                          view === "tidstrend" ? "totalrate" : "alle"
                        ]
                      }
                    </Grid>
                  </Grid>
                </MenuItem>
                {view === "tidstrend" && (
                  <MenuItem value={"total,1"}>
                    <Grid container alignItems="center" wrap="nowrap">
                      <Grid display="flex">
                        <NumbersIcon sx={{ marginRight: 1 }} color="primary" />
                      </Grid>
                      <Grid>{dict.analysebox.number_variable}</Grid>
                    </Grid>
                  </MenuItem>
                )}
                {analyse.views.map((v, i) => {
                  return v.name === "total" ||
                    (view === "demografi" && !demographyAvailable[v.name])
                    ? []
                    : [
                        <ListSubheader key={i}>{v.title[lang]}</ListSubheader>,
                      ].concat(
                        v.variables.map((variable, j) => (
                          <MenuItem
                            value={`${v.name},${j}`}
                            key={`${v.name}_${j}`}
                          >
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
                      );
                })}
              </Select>
            </FormControl>
          </Grid>
        )}

        {view !== "tidstrend" && (
          <Grid
            size={{ xs: 12, md: 4 }}
            display="flex"
            sx={{ height: "3.75rem" }}
            justifyContent="center"
            alignItems="center"
          >
            <>
              <FormControl
                fullWidth
                sx={{ height: "100%", display: { xs: "none", md: "flex" } }}
              >
                <InputLabel
                  id="select-year-label"
                  shrink
                  sx={{
                    background: "white",
                    paddingX: 1,
                    borderRadius: 4,
                    boxShadow: yearSelector
                      ? "inset 0px -4px 2px rgb(194, 194, 194)"
                      : "none",
                  }}
                >
                  {dict.analysebox.year_select}
                </InputLabel>
                <Button
                  sx={{
                    ...(yearSelector ? {} : { color: "black" }),
                    height: "100%",
                    paddingX: 1.5,
                    fontSize: "1.1667rem",
                    fontWeight: 400,
                    textTransform: "none",
                    justifyContent: "space-between",
                  }}
                  color="primary"
                  size="large"
                  disableRipple
                  variant={yearSelector ? "contained" : "outlined"}
                  endIcon={
                    yearSelector ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon
                        sx={{ color: "rgba(0, 0, 0, 0.54)" }}
                      />
                    )
                  }
                  onClick={() => setYearSelector(!yearSelector)}
                >
                  {year === "all_years" ? dict.analysebox.all_years : year}
                </Button>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <InputLabel id="select-year-label">
                  {dict.analysebox.year_select}
                </InputLabel>
                <Select
                  labelId="select-year-label"
                  id="select-year"
                  value={year.toString()}
                  label={dict.analysebox.year_select}
                  onChange={(e) =>
                    setYear(
                      e.target.value === "all_years"
                        ? "all_years"
                        : Number(e.target.value),
                    )
                  }
                >
                  {view === "demografi" && (
                    <MenuItem value={"all_years"}>
                      {dict.analysebox.all_years}
                    </MenuItem>
                  )}
                  {years.map((y) => (
                    <MenuItem key={y.toString()} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          </Grid>
        )}
      </Grid>

      {yearSelector && view !== "tidstrend" && (
        <Zoom in={yearSelector && view !== "tidstrend"}>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
              marginTop: 2,
              paddingLeft: 1,
              paddingRight: 5,
              paddingBottom: 1,
            }}
          >
            <Box>
              {animating ? (
                <IconButton onClick={() => setAnimating(false)}>
                  <PauseIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setAnimating(true);
                    var currentYear = ["all_years", lastYear].includes(year)
                      ? Math.min(...years) - 1
                      : (year as number);
                    (function loop() {
                      setTimeout(
                        () => {
                          if (currentYear < lastYear && animatingRef.current) {
                            currentYear++;
                            setYear(currentYear);

                            loop();
                          } else {
                            setAnimating(false);
                          }
                        },
                        600 + 400 * Number(view !== "demografi"),
                      );
                    })();
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              )}
            </Box>
            <Box sx={{ flexGrow: 1, marginLeft: 2 }}>
              <Slider
                value={year === "all_years" ? lastYear + 1 : year}
                step={1}
                min={Math.min(...years)}
                max={lastYear + Number(view === "demografi")}
                onChange={(_, value) => {
                  if (value === lastYear + 1) setYear("all_years");
                  else setYear(value as number);
                }}
                valueLabelFormat={(value) =>
                  value === lastYear + 1
                    ? dict.analysebox.all_years
                    : value.toString()
                }
                valueLabelDisplay="auto"
                marks={years
                  .map((year) => ({
                    value: year,
                    label: year.toString(),
                  }))
                  .concat({
                    value: lastYear + 1,
                    label: dict.analysebox.all_years,
                  })}
                sx={{
                  "@media (max-width: 600px)": {
                    "& .MuiSlider-markLabel": {
                      fontSize: "0.75rem",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Zoom>
      )}

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
              const filename = !currentView
                ? `${analyse.name}_tidstrend.png`
                : `${analyse.name}_${currentView.title[lang].toLowerCase().replace(" ", "_")}_${year}.png`;

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
              variable={variable}
              showNorway={showNorway}
              selection={selection}
              lang={lang}
              maxValue={maxValues[variable[0]][variable[1]]}
            />
          ) : view === "demografi" ? (
            <AnalyseDemography
              analyse={analyse}
              showGenders={showGenders}
              variable={variable}
              andel={demographyAndel}
              lang={lang}
              year={year}
              years={years}
            />
          ) : (
            <AnalyseBarChart
              analyse={analyse}
              year={year as number}
              level={level}
              view={currentView as View}
              lang={lang}
              maxValue={maxValues["total"][0]}
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
            paddingBottom: 0,
            "@media print": { padding: 0 },
          }}
        >
          {view === "demografi" ? (
            <>
              <Typography variant="body2">
                {demographyAndel
                  ? dict.analysebox[
                      showGenders
                        ? "demography_proportion_gender"
                        : "demography_proportion"
                    ]
                  : dict.analysebox[
                      showGenders
                        ? "demography_n_people_gender"
                        : "demography_n_people"
                    ]}
              </Typography>
            </>
          ) : view !== "tidstrend" || String(variable) === "total,0" ? (
            <Typography variant="body2">
              {getDescription(analyse, lang, "rate")}
            </Typography>
          ) : view === "tidstrend" && String(variable) === "total,1" ? (
            <>
              <Typography variant="body2">
                {getDescription(analyse, lang, "antall")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  paddingX: 2,
                  paddingY: 1,
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
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
              </Box>
            </>
          ) : (
            <Typography variant="body2">
              {getDescription(analyse, lang, "rate")}
              {": "}
              <i>
                {
                  (analyse.views.find((v) => v.name === variable[0]) as View)
                    .variables[variable[1]][lang]
                }
              </i>
            </Typography>
          )}
        </Box>
        {view === "demografi" && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingX: 2,
                paddingY: 1,
                alignItems: "center",
              }}
            >
              <ToggleButtonGroup
                color="primary"
                value={demographyAndel ? "andel" : "antall"}
                exclusive
                size="small"
                onChange={() => setDemographyAndel(!demographyAndel)}
                aria-label="Platform"
              >
                <ToggleButton value={"antall"}>Antall</ToggleButton>
                <ToggleButton value={"andel"}>Andel</ToggleButton>
              </ToggleButtonGroup>

              <FormControlLabel
                disabled={analyse.kjonn !== "begge"}
                control={
                  <Switch
                    checked={showGenders}
                    onChange={() => setShowGenders(!showGenders)}
                  />
                }
                label={dict.analysebox.demography_split_gender}
              />
            </Box>
          </>
        )}
      </Box>

      <Box
        sx={{
          padding: 2,
          paddingBottom: 0,
          paddingTop: 2,
          displayPrint: "none",
        }}
      >
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
        slots={{ transition: Slide }}
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
