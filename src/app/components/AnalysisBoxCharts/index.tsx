"use client";
import * as React from "react";
import {
  ResponsiveChartContainer,
  BarPlot,
  LinePlot,
  ChartsXAxis,
  ChartsYAxis,
  LineChart,
} from "@mui/x-charts";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Analysis } from "@/app/models/AnalysisModel";
import {
  AnalysisDataGroup,
  AnalysisDataGroupPlain,
  ChartSeriesArray,
  ChartTypeString,
  sumVariables,
  toSeriesArray,
} from "@/app/lib/chartDataUtils";

interface AnalysisBoxChartsProps {
  analysis: Analysis;
  lang: string;
}

const toLineChartSeries = (
  group: AnalysisDataGroupPlain,
): AnalysisDataGroupPlain => {
  return sumVariables(group);
};

const toBarChartSeries = (
  group: AnalysisDataGroupPlain,
): AnalysisDataGroupPlain => {
  return group;
};

const addLineChartProps = (seriesArray: ChartSeriesArray) => {
  seriesArray.series.map((series) => {
    Object.assign(series, {
      type: "line",
      layout: "vertical",
      curve: "linear",
    });
  });
};

const addBarChartProps = (seriesArray: ChartSeriesArray) => {
  seriesArray.series.map((series) => {
    Object.assign(series, {
      type: "bar",
      stack: "total",
      layout: "horizontal",
    });
  });
};

const getChartSettings = (type: string, data: any) => {
  const chartSettings: any = {};

  if (type === "line") {
    chartSettings.xAxis = [
      {
        data: data,
        id: "line-x-axis-id",
        scaleType: "point",
      },
    ];
    chartSettings.yAxis = [
      {
        id: "line-y-axis-id",
        scaleType: "linear",
      },
    ];
  } else if (type === "bar") {
    chartSettings.xAxis = [
      {
        id: "bar-x-axis-id",
        scaleType: "linear",
      },
    ];
    chartSettings.yAxis = [
      {
        data: data,
        id: "bar-y-axis-id",
        scaleType: "band",
      },
    ];
  }

  return chartSettings;
};

export default function AnalysisBoxCharts({
  analysis,
  lang,
}: AnalysisBoxChartsProps) {
  const [type, setType] = React.useState<ChartTypeString>("bar");

  const group: AnalysisDataGroupPlain = analysis.data.sykehus["15"];
  const modifiedGroup =
    type === "line" ? toLineChartSeries(group) : toBarChartSeries(group);
  const seriesArray = toSeriesArray(
    modifiedGroup as AnalysisDataGroup,
    analysis.variables,
    type,
  );

  if (type === "line") {
    addLineChartProps(seriesArray);
  } else if (type === "bar") {
    addBarChartProps(seriesArray);
  }

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as ChartTypeString);
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <FormControl fullWidth={true}>
          <InputLabel id={`chart-select-label-${analysis._id}`}>
            Figurtype
          </InputLabel>
          <Select
            id={`chart-select-${analysis._id}`}
            labelId={`chart-select-label-${analysis._id}`}
            label="Figurtype"
            value={type}
            onChange={handleChange}
          >
            <MenuItem
              value={"bar"}
              key={`chart-select-bar-${analysis._id}`}
              id={`chart-select-bar-${analysis._id}`}
            >
              Søyle
            </MenuItem>
            <MenuItem
              value={"line"}
              key={`chart-select-line-${analysis._id}`}
              id={`chart-select-line-${analysis._id}`}
            >
              Linje
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box width={"70vw"} height={"40vh"}>
        <ResponsiveChartContainer
          series={seriesArray.series}
          {...getChartSettings(type, seriesArray.keys)}
        >
          <BarPlot skipAnimation={true} />
          <LinePlot skipAnimation={true} />
          {type === "line" ? (
            <>
              <ChartsXAxis
                label="År"
                position="bottom"
                axisId="line-x-axis-id"
              />
              <ChartsYAxis
                label="Rate"
                position="left"
                axisId="line-y-axis-id"
              />
            </>
          ) : (
            <>
              <ChartsXAxis
                label="Rate"
                position="bottom"
                axisId="bar-x-axis-id"
              />
              <ChartsYAxis
                label="År"
                position="left"
                axisId="bar-y-axis-id"
                disableTicks={true}
              />
            </>
          )}
        </ResponsiveChartContainer>
      </Box>
    </>
  );
}
