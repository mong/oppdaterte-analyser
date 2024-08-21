"use client";
import * as React from "react";
import {
  ResponsiveChartContainer,
  BarPlot,
  ChartsXAxis,
  LinePlot,
} from "@mui/x-charts";
import { Box, MenuItem, TextField } from "@mui/material";
import { Analysis } from "@/app/models/AnalysisModel";

interface AnalysisBoxChartsProps {
  analysis: Analysis;
  lang: string;
}

export default function AnalysisBoxCharts({
  analysis,
  lang,
}: AnalysisBoxChartsProps) {
  const [type, setType] = React.useState<"line" | "bar">("line");

  const hospital: any = analysis.data.sykehus["2"];
  const years = Object.keys(hospital);
  const series1: number[] = [];
  const series2: number[] = [];

  years.forEach((year) => {
    const yearVals: number[] = hospital[year];
    series1.push(Number(yearVals[0]));
    series2.push(Number(yearVals[1]));
  });

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        select
        value={type}
        onChange={(event) => setType(event.target.value as "line" | "bar")}
        label="Figurtype"
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="line">line</MenuItem>
        <MenuItem value="bar">bar</MenuItem>
      </TextField>

      <div>
        <ResponsiveChartContainer
          series={[
            {
              type,
              data: series1,
            },
            {
              type,
              data: series2,
            },
          ]}
          xAxis={[
            {
              data: years,
              scaleType: "band",
              id: "x-axis-id",
            },
          ]}
          height={200}
        >
          <BarPlot />
          <LinePlot />
          <ChartsXAxis label="X axis" position="bottom" axisId="x-axis-id" />
        </ResponsiveChartContainer>
      </div>
    </Box>
  );
}
