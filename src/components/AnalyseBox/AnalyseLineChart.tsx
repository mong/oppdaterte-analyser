import { Analyse, Lang } from "@/types";
import { LineChart } from "@mui/x-charts/LineChart";
import { regions_dict, Selection } from "@/lib/nameMapping";
import React from "react";

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

  const dataset = React.useMemo(() => {
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
      series={selectionIDs.map((area) => ({
        dataKey: area,
        id: area,
        curve: "linear",
        showMark: false,
        label: regions_dict[lang][level][Number(area)],
      }))}
      onLineClick={(a, b) => console.log("Info: ", a, b)}
      tooltip={{ trigger: "axis" }}
      slotProps={{
        loadingOverlay: { message: dict.choose_area },
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
        "& .MuiLineElement-root:hover": {
          strokeWidth: "5px",
        },
      }}
    />
  );
};
