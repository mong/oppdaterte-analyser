import { BarChart, barClasses } from "@mui/x-charts/BarChart";
import type { BarProps } from '@mui/x-charts/BarChart';
import classNames from "@/lib/ChartClasses.module.css";

import React from "react";

import { useAnimateBar } from '@mui/x-charts/hooks';

function AnimatedBar(props: BarProps & { special_bars: Set<number>, selected_bars: Set<number> }) {
  const { ownerState, ...other } = props;
  const animatedProps = useAnimateBar(props);

  return (
    <rect
      {...other}
      className={
        `${other.className}
        ${props.special_bars.has(props.dataIndex) ? classNames.national : ""}
        ${props.selected_bars.has(props.dataIndex) ? classNames.selected : ""}
        cursor-pointer
        `}
      {...animatedProps}
      fill={ownerState.color}
    />
  );
}

interface AnalyseBarChartProps {
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
}

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
      dataset={data}
      hideLegend={variables.length < 2}
      series={variables.map((variable, i) => ({
        dataKey: variable,
        label: variableFmt(variable),
        valueFormatter: valueFmt,
        stack: "yes",
        id: `${i}`,
        color: `var(--bar-${variables.length - i})`
      }))}
      yAxis={[
        {
          scaleType: "band",
          dataKey: "category",
          tickPlacement: "middle",
          valueFormatter: categoryFmt,
          width: 110,
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
        bar: AnimatedBar as any
      }}
      slotProps={{
        bar: {
          special_bars: new Set(data.flatMap((value, i) => special_values.has(value.category) ? [i] : [])),
          selected_bars: new Set(data.flatMap((value, i) => selection.has(value.category) ? [i] : []))
        } as any
      }}
      sx={{
        [`& .${barClasses.element}`]: {
          // Speeds up or slows down the CSS transitions applied to the bars
          transition: 'all .24s cubic-bezier(0, 0.8, 0.3, 1)',
        },
      }}
      onAxisClick={(_, params) => onClick(String(params?.axisValue))}
    />
  );
};
