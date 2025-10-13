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
  ListSubheader,
  FormControlLabel,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Zoom,
  Tab,
  Paper,
  Stack,
  styled,
  toggleButtonGroupClasses,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { Analyse, Lang, View } from "@/types";
import { AnalyseBarChart } from "./AnalyseBarChart";
import { AnalyseLineChart } from "./AnalyseLineChart";

import { getAreaName, hospitalStructure, Selection } from "@/lib/selection";

import {
  capitalize,
  formatNumber,
  getDescription,
  getVariableText,
} from "@/lib/helpers";
import AnalyseDemography from "./AnalyseDemography";


const BACKGROUND_COLOR = "#F8F8FF";

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
      <InputLabel id="select-variable-label">
        {dict.analysebox.choose_variable}
      </InputLabel>
      <Select
        labelId="select-variable-label"
        id="select-variable"
        value={
          variable.viewName === "total"
            ? ""
            : (`${variable.viewName}.${variable.name}` as string)
        }
        label={dict.analysebox.choose_variable}
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
          <em>{dict.analysebox.remove_choice}</em>
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

const GraphBox = styled(Box)({
  width: "100%",
  height: "80vw",
  maxHeight: "700px",
  minHeight: "370px",
  marginTop: 0,
  position: "sticky",
});

const DescriptionBox = styled(Box)({
  textAlign: "center",
  padding: 10,
  paddingBottom: 0,
  "@media print": { padding: 0 },
});

const MyTabList = styled(TabList)({
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

  const [level, setLevel] = React.useState<"region" | "sykehus">("sykehus");



  const aggregeringTypes = analyse.views.reduce(
    (prev, curr) => prev.union(
      new Set(curr.aggregering === "begge" ? ["kont", "pas"] : [curr.aggregering as "kont" | "pas"])),
    new Set<"kont" | "pas">()
  )
  console.log("AggregeringTypes", aggregeringTypes, aggregeringTypes.size)


  const [aggregering, setAggregering] = React.useState<"kont" | "pas">(
    aggregeringTypes.size === 1 ? aggregeringTypes.values().next().value! : "kont"
  );
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

    return !year_range?.length
      ? ["NA"]
      : Array.from(
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
                lastYear === year ? Math.min(...(years as number[])) - 1 : year;
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
          min={Math.min(...(years as number[]))}
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
              value: year as number,
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
    dict.analysebox.choose_area +
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
            <em>{dict.analysebox.remove_choice}</em>
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
      {aggregeringTypes.size === 2 &&
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
          {analyse.kontakt_begrep
            ? capitalize(analyse.kontakt_begrep[lang])
            : dict.analysebox.kontakter}
        </ToggleButton>
        <ToggleButton value={"pas"} sx={{ transition: "all 0.3s ease" }}>
          {dict.analysebox.pasienter}
        </ToggleButton>
      </StyledToggleButtonGroup>}
      <StyledToggleButtonGroup
        color="primary"
        value={verdiType}
        exclusive
        onChange={() => setVerdiType(verdiType === "rate" ? "n" : "rate")}
      >
        <ToggleButton value={"rate"}>Rate</ToggleButton>
        <ToggleButton value={"n"}>{dict.analysebox.antall}</ToggleButton>
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
          <TabPanel value="analyse" sx={{ paddingX: 0, paddingBottom: 0 }}>
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
                    label={dict.analysebox.single_year}
                    value="enkeltår"
                    sx={{ textTransform: "none" }}
                  />
                  <Tab
                    icon={<InsightsIcon fontSize="small" />}
                    iconPosition="start"
                    label={dict.analysebox.time_series}
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
                      {dict.analysebox.choose_focus_area}
                    </InputLabel>
                    <Select
                      labelId="select-view-label"
                      id="select-view"
                      value={viewName === "total" ? "" : viewName}
                      label={dict.analysebox.choose_focus_area}
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
                        <em>{dict.analysebox.remove_choice}</em>
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
                <GraphBox>
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
                    valueFmt={(v) =>
                      formatNumber(
                        v || 0,
                        lang,
                        verdiType === "n" && aggregering === "pas"
                          ? { maximumFractionDigits: 0 }
                          : undefined,
                      )
                    }
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
                </GraphBox>
                <DescriptionBox>
                  {getDescription(analyse, lang, verdiType, aggregering)}
                </DescriptionBox>
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
                <GraphBox>
                  <AnalyseLineChart
                    analyse={analyse}
                    years={years as number[]}
                    level={level}
                    categoryFmt={(category) => getAreaName(category, lang)}
                    valueFmt={(v) =>
                      formatNumber(
                        v || 0,
                        lang,
                        verdiType === "n" && aggregering === "pas"
                          ? { maximumFractionDigits: 0 }
                          : undefined,
                      )
                    }
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
                </GraphBox>
                <DescriptionBox>
                  {getDescription(
                    analyse,
                    lang,
                    verdiType,
                    aggregering,
                    tidstrendVariable.name !== analyse.name
                      ? tidstrendVariable
                      : undefined,
                  )}
                </DescriptionBox>
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
                <ToggleButton value={false}>
                  {dict.analysebox.alle}
                </ToggleButton>
                <ToggleButton value={true}>
                  {dict.analysebox.demography_split_gender}
                </ToggleButton>
              </StyledToggleButtonGroup>
              <StyledToggleButtonGroup
                color="primary"
                value={demographyAndel}
                exclusive
                onChange={() => setDemographyAndel(!demographyAndel)}
              >
                <ToggleButton value={false}>
                  {dict.analysebox.antall}
                </ToggleButton>
                <ToggleButton value={true}>
                  {dict.analysebox.andel}
                </ToggleButton>
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
                <ToggleButton value={false}>
                  {dict.analysebox.choose_year}
                </ToggleButton>
              </StyledToggleButtonGroup>
            </Stack>
            <Zoom in={!allYears}>
              {!allYears ? yearSelector : <span></span>}
            </Zoom>

            <GraphBox>
              <AnalyseDemography
                analyse={analyse}
                showGenders={showGenders}
                variable={demografiVariable}
                andel={demographyAndel}
                lang={lang}
                year={allYears ? "all_years" : year}
                years={years as number[]}
              />
            </GraphBox>
            <DescriptionBox>
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
                {demografiVariable.name !== analyse.name &&
                  getVariableText(analyse, lang, demografiVariable)}
              </Typography>
            </DescriptionBox>
          </TabPanel>
        </Paper>
      </TabContext>
    </Box>
  );
}
