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
  Tabs,
  Tab,
  Paper,
  Stack,
  styled,
  toggleButtonGroupClasses,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
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
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { Analyse, Lang, View } from "@/types";
import { AnalyseBarChart } from "./AnalyseBarChart";
import { AnalyseLineChart } from "./AnalyseLineChart";

import { getAreaName, hospitalStructure, Selection } from "@/lib/selection";
import AreaPicker from "@/components/AreaPicker";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { getDescription } from "@/lib/helpers";
import AnalyseDemography from "./AnalyseDemography";
import { textTransform } from "@mui/system";
import { ChildFriendlyOutlined } from "@mui/icons-material";
import { backgroundClip } from "html2canvas/dist/types/css/property-descriptors/background-clip";
import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";

const BACKGROUND_COLOR = "#F4F8FF";

export type VariableSelectorProps = {
  analyse: Analyse;
  views: View[];
  dict: { [k: string]: { [k: string]: string } };
  variable: { viewName: string; name: string };
  onClick: ({ viewName, name }: { viewName: string; name: string }) => void;
  lang: Lang;
  defaultText?: string;
};

function VariableSelector({
  analyse,
  views,
  dict,
  variable,
  onClick,
  lang,
}: VariableSelectorProps) {
  return (
    <FormControl size="small" focused={false}>
      <InputLabel id="select-variable-label">{"Velg variabel"}</InputLabel>
      <Select
        labelId="select-variable-label"
        id="select-variable"
        value={
          variable.viewName === "total"
            ? ""
            : (`${variable.viewName}.${variable.name}` as string)
        }
        label={"Velg variabel"}
        sx={{ minWidth: 250, height: "100%" }}
        onChange={(e) => {
          const [viewName, name] =
            e.target.value === "fjern_valg"
              ? ["total", analyse.name]
              : e.target.value.split(".");
          onClick({ viewName, name });
        }}
        MenuProps={{
          sx: {
            ["& .MuiList-root, & .MuiListSubheader-root"]: {
              backgroundColor: BACKGROUND_COLOR,
            },
          },
        }}
      >
        <MenuItem value={"fjern_valg"} disabled={variable.viewName === "total"}>
          <em>Fjern valg</em>
        </MenuItem>
        {views.map((v, i) => {
          return [
            <ListSubheader key={i}>{v.title[lang]}</ListSubheader>,
          ].concat(
            v.variables.map((variable, j) => (
              <MenuItem
                value={`${v.name}.${variable.name}`}
                key={`${v.name}_${j}`}
                sx={{ paddingLeft: 4 }}
              >
                {variable[lang]}
              </MenuItem>
            )),
          );
        })}
      </Select>
    </FormControl>
  );
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    textTransform: "none",
  },
});

const MyTabList = styled(TabList)({
  // marginBottom: -1,
  ["& .Mui-selected"]: { background: BACKGROUND_COLOR },
  ["& .MuiButtonBase-root"]: {
    minHeight: "unset",
    height: 48,
    borderRadius: "8px 8px 0px 0px",
  },
  ["& .MuiTabs-indicator"]: { display: "flex" },
});

export type ChartContainerProps = {
  analyse: Analyse;
  lang: Lang;
  dict: { [k: string]: { [k: string]: string } };
};

export function ChartContainer({ analyse, lang, dict }: ChartContainerProps) {
  const [animating, setAnimating] = React.useState(false);
  const animatingRef = React.useRef(false);
  React.useEffect(() => {
    animatingRef.current = animating;
  }, [animating]);

  const [showNorway, setShowNorway] = React.useState(false);
  const [verdiType, setVerdiType] = React.useState<"rate" | "n">("rate");
  const [tidstrendType, setTidstrendType] = React.useState<"rate" | "n">(
    "rate",
  );
  const [enkeltårType, setEnkeltårType] = React.useState<"rate" | "n">("rate");
  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");
  const [aggregering, setAggregering] = React.useState<"kont" | "pas">("kont");
  const [mainTab, setMainTab] = React.useState<"analyse" | "demografi">(
    "analyse",
  );
  const [analyseTab, setAnalyseTab] = React.useState<"enkeltår" | "tidstrend">(
    "enkeltår",
  );
  const [allYears, setAllYears] = React.useState(true);

  const views = React.useMemo(
    () => Object.fromEntries(analyse.views.map((v) => [v.name, v])),
    [analyse],
  );
  const [viewName, setViewName] = React.useState("total");
  const currentView = views[viewName];

  const [tidstrendVariable, setTidstrendVariable] = React.useState({
    viewName: "total",
    name: analyse.name,
  });
  const [demografiVariable, setDemografiVariable] = React.useState({
    viewName: "total",
    name: analyse.name,
  });

  const [showGenders, setShowGenders] = React.useState(true);
  const [demographyAndel, setDemographyAndel] = React.useState(false);

  const [selection, setSelection] = React.useState(
    new Selection({ region: new Set([]), sykehus: new Set([]) }),
  );

  const getYears = (viewName: string) => {
    const year_range = (
      analyse.views.find(
        (v) =>
          v.name ===
          (["demografi", "tidstrend"].includes(viewName) ? "total" : viewName),
      ) as View
    ).year_range;

    return Array.from(
      { length: year_range[1] - year_range[0] + 1 },
      (_, i) => year_range[0] + i,
    );
  };

  const years = getYears(viewName);
  const lastYear = years.at(-1) as number;
  const [year, setYear] = React.useState<number>(lastYear);

  const demographyAvailable = new Set(
    Object.keys(analyse.data.demografi[lastYear]),
  ).difference(new Set(["population"]));

  const maxValues = React.useMemo(() => {
    /* Calculates the max for all values accross years and areas (or other categories) */
    return Object.fromEntries(
      ["demografi", ...analyse.views.map((v) => v.name)].map((viewName) => {
        const view_years = getYears(viewName);
        const levels_or_views = Object.keys(
          analyse.data[viewName][view_years[0]],
        );
        return [
          viewName,
          Object.fromEntries(
            levels_or_views.map((level_or_view) => {
              const categories = Object.keys(
                analyse.data[viewName][view_years[0]][level_or_view],
              );
              const variables = Object.keys(
                analyse.data[viewName][view_years[0]][level_or_view][
                  categories[0]
                ],
              );
              const inflections = Object.keys(
                analyse.data[viewName][view_years[0]][level_or_view][
                  categories[0]
                ][variables[0]],
              );
              return [
                level_or_view,
                Object.fromEntries(
                  variables.map((variable) => {
                    return [
                      variable,
                      Object.fromEntries(
                        inflections.map((inflection) => [
                          inflection,
                          {
                            all: Math.max(
                              ...view_years.flatMap((year) =>
                                categories.map(
                                  (category) =>
                                    analyse.data[viewName][year][level_or_view][
                                      category
                                    ][variable][inflection],
                                ),
                              ),
                            ),
                            withoutNorway: Math.max(
                              ...view_years.flatMap((year) =>
                                categories
                                  .filter((c) => c !== "Norge")
                                  .map(
                                    (category) =>
                                      analyse.data[viewName][year][
                                        level_or_view
                                      ][category][variable][inflection],
                                  ),
                              ),
                            ),
                          },
                        ]),
                      ),
                    ];
                  }),
                ),
              ];
            }),
          ),
        ];
      }),
    );
  }, [analyse]);

  const varNames = React.useMemo(
    () =>
      Object.fromEntries(
        analyse.views.flatMap((view) =>
          view.variables.map((variable) => [variable.name, variable]),
        ),
      ),
    [analyse],
  );

  const yearSelector = (
    <Stack direction="row" sx={{ paddingY: 2 }}>
      <Box>
        {animating ? (
          <IconButton onClick={() => setAnimating(false)}>
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              setAnimating(true);
              var currentYear =
                lastYear === year ? Math.min(...years) - 1 : year;
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
                  600 + 400 * Number(mainTab !== "demografi"),
                );
              })();
            }}
          >
            <PlayArrowIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ flexGrow: 1, marginX: 2, marginRight: 4 }}>
        <Slider
          track={false}
          value={year}
          step={1}
          min={Math.min(...years)}
          max={lastYear}
          onChange={(_, value) => setYear(value as number)}
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
    </Stack>
  );

  const [areasOpen, setAreasOpen] = React.useState(false);

  const chooseAreasText =
    "Velg opptaksområder" +
    (selection[level].size ? ` (${selection[level].size})` : "");

  const areaAndAggregationSelect = (
    <Stack
      direction="row"
      spacing={3}
      sx={{ paddingY: 1, paddingX: 4, height: 60, marginBottom: 1 }}
    >
      <FormControl size="small" focused={false} sx={{ width: 300 }}>
        <InputLabel htmlFor="grouped-select">{chooseAreasText}</InputLabel>
        <Select
          multiple
          sx={{ height: "100%" }}
          value={!areasOpen ? [] : Array.from(selection[level])}
          id="grouped-select"
          label={chooseAreasText}
          open={areasOpen}
          onClose={() => setAreasOpen(false)}
          onOpen={() => setAreasOpen(true)}
          onChange={(e) => {
            const changedArea = String(
              Array.from(
                selection[level].symmetricDifference(new Set(e.target.value)),
              ).at(0),
            );

            if (changedArea === "fjern_valg") {
              setSelection(
                new Selection({ region: new Set([]), sykehus: new Set([]) }),
              );
            } else {
              setSelection(
                level === "region"
                  ? selection.toggleRegion(changedArea)
                  : selection.toggleSykehus(changedArea),
              );
            }

            console.log(changedArea);
          }}
          MenuProps={{
            sx: {
              ["& .MuiList-root, & .MuiListSubheader-root"]: {
                backgroundColor: BACKGROUND_COLOR,
              },
            },
            PaperProps: {
              style: { maxHeight: 400, width: 300 },
            },
          }}
        >
          <MenuItem value="fjern_valg" disabled={selection[level].size === 0}>
            <em>Fjern valg</em>
          </MenuItem>

          {Object.keys(hospitalStructure).map((region) =>
            level === "region" ? (
              <MenuItem key={region} value={region}>
                {getAreaName(region, lang)}
              </MenuItem>
            ) : (
              [
                <ListSubheader>{getAreaName(region, lang)}</ListSubheader>,
                Array.from(hospitalStructure[region])
                  .toSorted()
                  .map((sykehus) => (
                    <MenuItem
                      key={sykehus}
                      value={sykehus}
                      sx={{ paddingLeft: 4 }}
                    >
                      {getAreaName(sykehus, lang)}
                    </MenuItem>
                  )),
              ]
            ),
          )}
        </Select>
      </FormControl>
      <StyledToggleButtonGroup
        color="primary"
        value={level}
        exclusive
        onChange={() => setLevel(level === "sykehus" ? "region" : "sykehus")}
        aria-label={dict.analysebox.area_select}
      >
        <ToggleButton value={"sykehus"}>{dict.analysebox.sykehus}</ToggleButton>
        <ToggleButton value={"region"}>{dict.analysebox.region}</ToggleButton>
      </StyledToggleButtonGroup>
      <StyledToggleButtonGroup
        color="primary"
        value={aggregering}
        exclusive
        onChange={() => {
          const newAggregering = aggregering === "kont" ? "pas" : "kont";
          setAggregering(newAggregering);
          if (!["begge", newAggregering].includes(currentView.aggregering)) {
            setViewName("total");
          }
          if (
            !["begge", newAggregering].includes(
              views[tidstrendVariable.viewName].aggregering,
            )
          ) {
            setTidstrendVariable({ viewName: "total", name: analyse.name });
          }
        }}
      >
        <ToggleButton value={"kont"} sx={{ transition: "all 0.3s ease" }}>
          Kontakter
        </ToggleButton>
        <ToggleButton value={"pas"} sx={{ transition: "all 0.3s ease" }}>
          Pasienter
        </ToggleButton>
      </StyledToggleButtonGroup>
      <StyledToggleButtonGroup
        color="primary"
        value={verdiType}
        exclusive
        onChange={() => setVerdiType(verdiType === "rate" ? "n" : "rate")}
      >
        <ToggleButton value={"rate"}>Rate</ToggleButton>
        <ToggleButton value={"n"}>Antall</ToggleButton>
      </StyledToggleButtonGroup>
    </Stack>
  );

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={mainTab}>
        <MyTabList
          onChange={(_, value) => setMainTab(value)}
          aria-label="Type datavisning"
        >
          <Tab
            icon={<AssessmentIcon fontSize="small" />}
            iconPosition="start"
            label="Analyse"
            value="analyse"
            sx={{ textTransform: "none" }}
          />
          <Tab
            icon={<GroupsIcon fontSize="small" />}
            iconPosition="start"
            label={dict.analysebox.demography}
            value="demografi"
            sx={{ textTransform: "none" }}
          />
        </MyTabList>
        <Paper
          sx={{ background: BACKGROUND_COLOR, borderRadius: "0px 0px 8px 8px" }}
          elevation={2}
        >
          <TabPanel value="analyse" sx={{ paddingX: 0 }}>
            {areaAndAggregationSelect}
            <TabContext value={analyseTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider", marginX: 4 }}>
                <MyTabList
                  onChange={(_, value) => {
                    setAnalyseTab(value);
                  }}
                  aria-label="Type datavisning"
                >
                  <Tab
                    icon={<BarChartIcon fontSize="small" />}
                    iconPosition="start"
                    label="Enkeltår"
                    value="enkeltår"
                    sx={{ textTransform: "none" }}
                  />
                  <Tab
                    icon={<InsightsIcon fontSize="small" />}
                    iconPosition="start"
                    label="Tidstrend"
                    value="tidstrend"
                    sx={{ textTransform: "none" }}
                  />
                </MyTabList>
              </Box>
              <TabPanel value="enkeltår" sx={{ paddingX: 4 }}>
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{ paddingY: 1, height: 60 }}
                >
                  <FormControl size="small" focused={false}>
                    <InputLabel id="select-view-label">
                      Velg fokusområde
                    </InputLabel>
                    <Select
                      labelId="select-view-label"
                      id="select-view"
                      value={viewName === "total" ? "" : viewName}
                      label={"Velg fokusområde"}
                      sx={{ minWidth: 250, height: "100%" }}
                      onChange={(e) => {
                        setViewName(
                          e.target.value === "fjern_valg"
                            ? "total"
                            : e.target.value,
                        );
                      }}
                      MenuProps={{
                        sx: {
                          ["& .MuiList-root, & .MuiListSubheader-root"]: {
                            backgroundColor: BACKGROUND_COLOR,
                          },
                        },
                      }}
                    >
                      <MenuItem
                        value={"fjern_valg"}
                        disabled={viewName === "total"}
                      >
                        <em>Fjern valg</em>
                      </MenuItem>
                      {analyse.views
                        .filter(
                          (v) =>
                            v.type === "standard" &&
                            v.name !== "total" &&
                            ["begge", aggregering].includes(v.aggregering),
                        )
                        .map((view, i) => (
                          <MenuItem key={i} value={view.name}>
                            {view.title[lang]}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
                {yearSelector}
                <AnalyseBarChart
                  categories={Object.keys(
                    analyse.data[viewName][lastYear][level],
                  ).filter((cat) => cat !== "Norge" || verdiType === "rate")}
                  variables={currentView.variables.map(
                    (variable) => variable.name,
                  )}
                  valueGetter={(category, variable) =>
                    analyse.data[viewName][year][level][category][variable][
                      `${aggregering}_${verdiType}`
                    ]
                  }
                  variableFmt={(variable) => varNames[variable][lang]}
                  categoryFmt={(category) => getAreaName(category, lang)}
                  valueAxisFmt={(v) => new Intl.NumberFormat(lang).format(v)}
                  special_values={new Set(["Norge"])}
                  selection={
                    level === "region" ? selection.region : selection.sykehus
                  }
                  onClick={(area) =>
                    area !== "Norge" &&
                    setSelection(
                      level === "region"
                        ? selection.toggleRegion(area)
                        : selection.toggleSykehus(area),
                    )
                  }
                  maxValue={
                    maxValues["total"][level][analyse.name][
                      `${aggregering}_${verdiType}`
                    ].withoutNorway
                  }
                />
              </TabPanel>
              <TabPanel value="tidstrend" sx={{ paddingX: 4 }}>
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{ paddingY: 1, height: 60 }}
                >
                  <VariableSelector
                    analyse={analyse}
                    views={analyse.views
                      .filter((v) =>
                        ["begge", aggregering].includes(v.aggregering),
                      )
                      .slice(1)}
                    dict={dict}
                    lang={lang}
                    variable={tidstrendVariable}
                    onClick={(v) => setTidstrendVariable(v)}
                  />
                  {verdiType === "n" && (
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
                  )}
                </Stack>
                <AnalyseLineChart
                  analyse={analyse}
                  years={years}
                  level={level}
                  categoryFmt={(category) => getAreaName(category, lang)}
                  inflection={`${aggregering}_${verdiType}`}
                  variable={tidstrendVariable}
                  showNorway={verdiType === "rate" || showNorway}
                  selection={selection}
                  lang={lang}
                  maxValue={
                    maxValues[tidstrendVariable.viewName][level][
                      tidstrendVariable.name
                    ][`${aggregering}_${verdiType}`][
                      showNorway ? "all" : "withoutNorway"
                    ]
                  }
                />
              </TabPanel>
            </TabContext>
          </TabPanel>
          <TabPanel value="demografi" sx={{ paddingX: 4 }}>
            <Stack direction="row" spacing={3} sx={{ paddingY: 1, height: 60 }}>
              <StyledToggleButtonGroup
                color="primary"
                value={showGenders}
                exclusive
                onChange={() => setShowGenders(!showGenders)}
              >
                <ToggleButton value={false}>Alle</ToggleButton>
                <ToggleButton value={true}>Del på kjønn</ToggleButton>
              </StyledToggleButtonGroup>
              <StyledToggleButtonGroup
                color="primary"
                value={demographyAndel}
                exclusive
                onChange={() => setDemographyAndel(!demographyAndel)}
              >
                <ToggleButton value={false}>Antall</ToggleButton>
                <ToggleButton value={true}>Andel</ToggleButton>
              </StyledToggleButtonGroup>
              <VariableSelector
                analyse={analyse}
                views={analyse.views
                  .slice(1)
                  .filter((v) => demographyAvailable.has(v.name))}
                dict={dict}
                lang={lang}
                variable={demografiVariable}
                onClick={(v) => setDemografiVariable(v)}
              />
              <StyledToggleButtonGroup
                color="primary"
                value={allYears}
                exclusive
                onChange={() => setAllYears(!allYears)}
              >
                <ToggleButton value={true}>
                  {dict.analysebox.all_years}
                </ToggleButton>
                <ToggleButton value={false}>Velg år</ToggleButton>
              </StyledToggleButtonGroup>
            </Stack>
            <Zoom in={!allYears}>
              {!allYears ? yearSelector : <span></span>}
            </Zoom>

            <Box
              sx={{
                width: "100%",
                height: "80vw",
                maxHeight: "700px",
                minHeight: "370px",
                marginTop: 0,
                position: "sticky",
              }}
            >
              <AnalyseDemography
                analyse={analyse}
                showGenders={showGenders}
                variable={demografiVariable}
                andel={demographyAndel}
                lang={lang}
                year={allYears ? "all_years" : year}
                years={years}
              />
            </Box>
          </TabPanel>
        </Paper>
      </TabContext>
    </Box>
  );
}

/*

export function ChartContainer({ analyse, lang, dict }: ChartContainerProps) {
  
  if (analyse.views[0].name !== "total") {
    throw new Error(
      "Incorrect view order in datafile; the first view should be a total",
    );
  }

  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");
  const [view, setView] = React.useState("total");

  const year_range = (
    analyse.views.find(
      (v) =>
        v.name === (["demografi", "tidstrend"].includes(view) ? "total" : view),
    ) as View
  ).year_range;
  const years = Array.from(
    { length: year_range[1] - year_range[0] + 1 },
    (_, i) => year_range[0] + i,
  ).toReversed();

  const lastYear = year_range[1];
  console.log("Last year:", lastYear);
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

  const demographyAvailable = !analyse.data.demografi
    ? {}
    : Object.fromEntries(
        Object.keys(analyse.data.demografi[lastYear][analyse.age_range[0]])
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
              {analyse.data.demografi && (
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
*/
