import { Analyse, Lang } from "@/types";
import { LineChart } from "@mui/x-charts/LineChart";
import { Selection } from "@/lib/selection";
import React from "react";
import { formatNumber } from "@/lib/helpers";

const linechart_colors: {
  sykehus: { [k: string]: string };
  region: { [k: string]: string };
} = {
  sykehus: {
    Finnmark: "#C3A687",
    UNN: "#B8FFF5",
    Nordland: "#003283",
    Helgeland: "#2F654A",
    NordTrøndelag: "#F38411",
    St_Olav: "#42E0F5",
    Møre_og_Romsdal: "#81BD00",
    Førde: "#839C8F",
    Bergen: "#5C3229",
    Fonna: "#11F063",
    Stavanger: "#6B9B3A",
    Østfold: "#D9CB68",
    Akershus: "#BD0C2E",
    OUS: "#C5F542",
    Lovisenberg: "#E3A611",
    Diakonhjemmet: "#EF42F5",
    Innlandet: "#F0116E",
    Vestre_Viken: "#8D6A59",
    Vestfold: "#101010",
    Telemark: "#81A9E1",
    Sørlandet: "#FFA3EB",
    Norge: "#9AA2AB",
  },
  region: {
    Helse_Nord: "#C5F542",
    Helse_MidtNorge: "#F38411",
    Helse_Vest: "#81A9E1",
    Helse_SørØst: "#BD0C2E",
    Norge: "#9AA2AB",
  },
};

type AnalyseLineChartProps = {
  analyse: Analyse;
  years: number[];
  level: "region" | "sykehus";
  variable: { viewName: string; name: string };
  categoryFmt: (category: string) => string;
  valueFmt: (value: number | null) => string;
  showNorway: boolean;
  selection: Selection;
  inflection: string;
  maxValue: number;
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
  variable,
  showNorway,
  selection,
  inflection,
  categoryFmt,
  valueFmt,
  maxValue,
  lang,
}: AnalyseLineChartProps) => {
  const windowWidth = useWindowWidth();

  const dataset: { [k: number]: number; year: number }[] = React.useMemo(() => {
    return [...years].map((year) => {
      return {
        year: year,
        ...Object.fromEntries(
          Object.keys(analyse.data[variable.viewName][year][level]).map(
            (area) => [
              area,
              Number(
                analyse.data[variable.viewName][year][level][area][
                  variable.name
                ][inflection],
              ),
            ],
          ),
        ),
      };
    });
  }, [analyse, years, level, variable]);

  const smallFactor = Math.min(windowWidth / 1000, 1);
  const selectionIDs = ["Norge", ...Array.from(selection[level]).map(String)];

  return (
    <LineChart
      margin={{
        left: 60,
        top: 60 + 5 * selectionIDs.length,
        bottom: 25,
      }}
      dataset={dataset}
      xAxis={[
        {
          scaleType: "point",
          dataKey: "year",
          valueFormatter: (value) => `${value}`,
        },
      ]}
      yAxis={[{ min: 0, max: maxValue * 1.01 }]}
      series={selectionIDs
        .filter((area) => area !== "Norge" || showNorway)
        .map((area) => ({
          dataKey: area,
          id: area,
          valueFormatter: valueFmt,
          curve: "monotoneX",
          showMark: false,
          label: categoryFmt(area),
          color: linechart_colors[level][area],
        }))}
      slotProps={{
        legend: {
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
        noDataOverlay: {
          message: {
            no: "Ingen opptaksområder valgt",
            en: "No referrral areas chosen",
          }[lang],
        },
      }}
      sx={{
        "& .MuiLineElement-root": {
          strokeWidth: "3px",
        },
      }}
    />
  );
};
