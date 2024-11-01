import { Analyse, Lang } from "@/types";
import { LineChart } from "@mui/x-charts/LineChart";
import { regions_dict, Selection } from "@/lib/nameMapping";
import React from "react";

const linechart_colors: {
  sykehus: { [k: number]: string };
  region: { [k: number]: string };
} = {
  sykehus: {
    1: "#C3A687",
    2: "#B8FFF5",
    3: "#003283",
    4: "#2F654A",
    6: "#F38411",
    7: "#42E0F5",
    8: "#81BD00",
    10: "#839C8F",
    11: "#5C3229",
    12: "#11F063",
    13: "#6B9B3A",
    14: "#D9CB68",
    15: "#BD0C2E",
    16: "#C5F542",
    17: "#E3A611",
    18: "#EF42F5",
    19: "#F0116E",
    20: "#8D6A59",
    21: "#101010",
    22: "#81A9E1",
    23: "#FFA3EB",
    8888: "#9AA2AB",
  },
  region: {
    1: "#C5F542",
    2: "#F38411",
    3: "#81A9E1",
    4: "#BD0C2E",
    8888: "#9AA2AB",
  },
};

type AnalyseLineChartProps = {
  analyse: Analyse;
  years: number[];
  level: "region" | "sykehus";
  selection: Selection;
  lang: Lang;
  dict: { [k: string]: string };
};

export const useWindowWidth = () => {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

export const AnalyseLineChart = ({
  analyse,
  years,
  level,
  selection,
  lang,
  dict,
}: AnalyseLineChartProps) => {
  const windowWidth = useWindowWidth();

  const dataset: { [k: number]: number; year: number }[] = React.useMemo(() => {
    return [...years].reverse().map((year) => {
      return {
        year: year,
        ...Object.fromEntries(
          Object.keys(analyse.data[level]).map((area) => [
            area,
            analyse.data[level][area][year][0][0],
          ]),
        ),
      };
    });
  }, [analyse, years, level]);
  const maxValue = React.useMemo(
    () =>
      Math.max(
        ...dataset.flatMap((yearly_data) =>
          Object.keys(linechart_colors[level]).map(
            (area) => yearly_data[Number(area)],
          ),
        ),
      ),
    [analyse, years, level, dataset],
  );

  const smallFactor = Math.min(windowWidth / 1000, 1);
  const selectionIDs = ["8888", ...selection[level].map(String)];

  return (
    <LineChart
      loading={selectionIDs.length === 1}
      margin={{
        left: 50,
        top: 60 + 5 * selectionIDs.length,
      }}
      dataset={dataset}
      xAxis={[
        {
          scaleType: "point",
          dataKey: "year",
          valueFormatter: (y) => y.toString(),
          tickPlacement: "middle",
        },
      ]}
      yAxis={[{ min: 0, max: maxValue }]}
      series={selectionIDs.map((area) => ({
        dataKey: area,
        id: area,
        curve: "monotoneX",
        showMark: false,
        label: regions_dict[lang][level][Number(area)],
        color: linechart_colors[level][Number(area)],
      }))}
      tooltip={{ trigger: "axis" }}
      slotProps={{
        loadingOverlay: { message: dict.empty_area_selection },
        legend: {
          direction: "row",
          position: { vertical: "top", horizontal: "middle" },
          padding: {
            top: 10,
            left: 10,
            bottom: 20,
            right: 20,
          },
          itemMarkHeight: 5,
          itemMarkWidth: 5 + Math.round(15 * smallFactor),
          labelStyle: {
            fontSize: 6 + Math.round(12 * smallFactor),
          },
        },
      }}
      sx={{
        "& .MuiLineElement-root": {
          strokeWidth: "2.5px",
        },
        backgroundImage: "url('/img/logo-skde-graa.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "max(60px, 10%)",
        backgroundPosition: "bottom 65px right 5%",
      }}
    />
  );
};
