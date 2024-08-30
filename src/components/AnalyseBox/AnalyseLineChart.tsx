import { Analyse } from "@/models/AnalyseModel";
import { LineChart } from "@mui/x-charts/LineChart";
import { regions_dict } from "./nameMapping";
import React from "react";

type AnalyseLineChartProps = {
  analyse: Analyse;
  years: number[];
  level: "region" | "sykehus";
  view: Analyse["views"][number];
  lang: "en" | "no";
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
  view,
  lang,
}: AnalyseLineChartProps) => {
  const windowWidth = useWindowWidth();

  const dataset = React.useMemo(() => {
    const dataset = [];
    for (const year of [...years].reverse()) {
      const datapoint: { year: number; sum: number; [k: string]: number } = {
        year: year,
        sum: 0,
      };
      for (const area of Object.keys(analyse.data[level])) {
        if (datapoint[area] === undefined) datapoint[area] = 0;
        for (let i = 0; i < Math.max(view.labels?.length || 0, 1); i++) {
          datapoint[area] += analyse.data[level][area][year][0][i];
        }
      }
      dataset.push(datapoint);
    }
    return dataset;
  }, [analyse, years, level]);

  const smallFactor = Math.min(windowWidth / 1000, 1);

  return (
    <LineChart
      margin={{
        left: 70,
        top: level === "region" ? 80 : 145 + 60 * (1 - smallFactor),
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
      series={Object.keys(analyse.data[level]).map((area) => ({
        dataKey: area,
        id: area,
        curve: "linear",
        showMark: false,
        label: regions_dict[lang][level][area],
      }))}
      onLineClick={(a, b) => console.log("Info: ", a, b)}
      tooltip={{ trigger: "axis" }}
      slotProps={{
        legend: {
          direction: "row",
          position: { vertical: "top", horizontal: "middle" },
          padding: {
            top: 20,
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
