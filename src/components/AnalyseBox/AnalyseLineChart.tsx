import { Analyse, Lang } from "@/types";
import { LineChart } from "@mui/x-charts/LineChart";
import { regions_dict } from "./nameMapping";
import React from "react";

type AnalyseLineChartProps = {
  analyse: Analyse;
  years: number[];
  level: "region" | "sykehus";
  lang: Lang;
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
  lang,
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
