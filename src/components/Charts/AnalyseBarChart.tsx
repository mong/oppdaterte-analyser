import { Analyse, Lang, Text, View } from "@/types";
import { BarChart, BarElementPath } from "@mui/x-charts/BarChart";
import { Selection } from "@/lib/selection";
import { ChartsText } from "@mui/x-charts/ChartsText";
import React from "react";
import { formatNumber } from "@/lib/helpers";

type AnalyseBarChartProps = {
  categories: string[];
  categoryFmt: (category: string) => string;
  variables: string[];
  variableFmt: (variable: string) => string;
  valueGetter: (category: string, variable: string) => number;
  valueAxisFmt: (value: number) => string;
  valueFmt: (value: number | null) => string;
  special_values: Set<string>;
  selection: Set<string>;
  onClick: (category: string) => void;
  maxValue: number;
};

export const AnalyseBarChart = ({
  categories,
  categoryFmt,
  variables,
  variableFmt,
  valueGetter,
  valueAxisFmt,
  valueFmt,
  special_values,
  selection,
  onClick,
  maxValue,
}: AnalyseBarChartProps) => {
  const data = categories
    .map((category) => ({
      category,
      ...Object.fromEntries(
        variables.map((variable) => [
          variable,
          valueGetter(category, variable),
        ]),
      ),
      sum: variables
        .map((variable) => valueGetter(category, variable))
        .reduce((a, b) => a + b),
    }))
    .toSorted((a, b) => b.sum - a.sum);

  return (
    <BarChart
      margin={{ left: 120, bottom: 25 }}
      dataset={data}
      series={variables.map((variable, i) => ({
        dataKey: variable,
        label: variableFmt(variable),
        valueFormatter: valueFmt,
        stack: "yes",
        id: `${i}`,
        color: `rgba(46, 150, 255, ${0.85 * 0.65 ** i})`,
      }))}
      yAxis={[
        {
          scaleType: "band",
          dataKey: "category",
          tickPlacement: "middle",
          valueFormatter: categoryFmt,
        },
      ]}
      xAxis={[
        {
          min: 0,
          max: maxValue,
          valueFormatter: valueAxisFmt,
        },
      ]}
      layout="horizontal"
      slots={{
        bar: ({ ownerState, ...otherProps }) => (
          <BarElementPath
            {...otherProps}
            ownerState={{
              ...ownerState,
              color: special_values.has(data[ownerState.dataIndex]?.category)
                ? `rgba(120, 120, 140, ${0.85 * 0.65 ** Number(ownerState.id)})` // ownerState.id = series ID
                : selection.has(data[ownerState.dataIndex]?.category)
                  ? `rgba(16, 100, 205, ${0.85 * 0.65 ** Number(ownerState.id)})`
                  : `rgba(46, 150, 255, ${0.85 * 0.65 ** Number(ownerState.id)})`,
            }}
          />
        ),
      }}
      slotProps={{
        legend: { hidden: variables.length < 2 },
      }}
      onAxisClick={(_, params) => onClick(String(params?.axisValue))}
    />
  );

  /*
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
                `${area}.${location}`
              );
            },
          },
        ]}
        slots={{
          bar: ({ ownerState, ...otherProps }) => (
            <BarElementPath
              {...otherProps}
              ownerState={{
                ...ownerState,
                color:
                  dataIndexToArea[ownerState.dataIndex] === "Norge"
                    ? `rgba(120, 120, 140, ${0.85 * 0.65 ** Number(ownerState.id)})` // ownerState.id = series ID
                    : selection[level].has(
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
            if (view.name !== "total" && v !== null) {
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
    */
};
