import { Analyse, Lang, Text } from "@/types";
import { BarChart, BarElementPath } from "@mui/x-charts/BarChart";
import { regions_dict, Selection } from "@/lib/nameMapping";
import { ChartsText } from "@mui/x-charts/ChartsText";
import React from "react";
import { formatNumber } from "@/lib/helpers";

type AnalyseBarChartProps = {
  analyse: Analyse;
  year: number;
  level: "region" | "sykehus";
  view: number;
  lang: Lang;
  selection: Selection;
  maxValue: number;
  onClick: (n: number) => any;
};

export const AnalyseBarChart = ({
  analyse,
  year,
  level,
  view,
  lang,
  selection,
  maxValue,
  onClick,
}: AnalyseBarChartProps) => {
  const defaultLabels: { [k: string]: Text[] } = {
    total: [{ no: "Rate", en: "Rate" }],
  };

  const viewData = analyse.views[view];
  const labels = defaultLabels[viewData.name] || viewData.variables;

  type DataPoint = {
    area: string;
    sum: number;
    n?: number;
    [k: number]: number;
  };

  const dataset: DataPoint[] = [];
  for (let area of Object.keys(analyse.data[level])) {
    let datapoint: DataPoint = {
      area: area,
      sum: 0,
    };

    for (let i = 0; i < Math.max(viewData.variables?.length || 0, 1); i++) {
      datapoint[i] = analyse.data[level][area][year][view][i];
      datapoint.sum += datapoint[i];
    }
    if (viewData.name === "total") {
      datapoint.n = analyse.data[level][area][year][view][1];
    }

    dataset.push(datapoint);
  }
  dataset.sort((a, b) => b.sum - a.sum);

  const dataIndexToArea = Object.fromEntries(
    dataset.map((bar, i) => [i, Number(bar.area)]),
  );

  const getTotalObservations = (area: string) =>
    analyse.data[level][area][year][0][1];

  const nameToArea = Object.fromEntries(
    dataset.map((bar) => [
      regions_dict[lang][level][Number(bar.area)],
      Number(bar.area),
    ]),
  );

  return (
    <BarChart
      margin={{ left: 120, bottom: 25 }}
      dataset={dataset}
      xAxis={[
        {
          min: 0,
          max: maxValue,
          valueFormatter: (v) => new Intl.NumberFormat(lang).format(v),
        },
      ]}
      yAxis={[
        {
          scaleType: "band",
          dataKey: "area",
          tickPlacement: "middle",
          valueFormatter: (area, { location }) => {
            return (
              regions_dict[lang][level][area] +
              (location === "tooltip"
                ? ` (n = ${formatNumber(getTotalObservations(area), lang)})`
                : "")
            );
          },
        },
      ]}
      slots={{
        axisTickLabel: (props) => {
          const selected =
            props.text in nameToArea &&
            selection[level].includes(nameToArea[props.text]);
          return (
            <ChartsText
              {...props}
              style={{
                ...props.style,
                fontWeight: selected ? "bold" : "normal",
              }}
            />
          );
        },
        bar: ({ ownerState, ...otherProps }) => (
          <BarElementPath
            {...otherProps}
            ownerState={{
              ...ownerState,
              color:
                dataIndexToArea[ownerState.dataIndex] === 8888
                  ? `rgba(120, 120, 140, ${0.85 * 0.65 ** Number(ownerState.id)})` // ownerState.id = series ID
                  : selection[level].includes(
                        dataIndexToArea[ownerState.dataIndex],
                      )
                    ? `rgba(16, 100, 205, ${0.85 * 0.65 ** Number(ownerState.id)})`
                    : `rgba(46, 150, 255, ${0.85 * 0.65 ** Number(ownerState.id)})`,
            }}
          />
        ),
      }}
      slotProps={{
        legend: { hidden: labels.length < 2 },
      }}
      series={labels.map((label, i) => ({
        dataKey: i.toString(),
        id: `${i}`,
        valueFormatter: (v, context) => {
          let percent = "";
          if (view > 0 && v !== null) {
            percent = ` (${formatNumber(v / dataset[context.dataIndex].sum, lang, { style: "percent" })})`;
          }
          return formatNumber(v || 0, lang, {}) + percent;
        },
        stack: "stack_group",
        color: `rgba(46, 150, 255, ${0.85 * 0.65 ** i})`,
        label: label[lang],
      }))}
      onAxisClick={(_, params) => onClick(Number(params?.axisValue))}
      layout="horizontal"
      borderRadius={5}
    />
  );
};
