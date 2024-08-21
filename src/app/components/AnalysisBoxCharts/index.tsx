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

  const hospital: any = analysis.data.sykehus["15"];
  const years = Object.keys(hospital);
  const numVars = analysis.variables.length;

  const seriesArray = Array(numVars);
  console.log(analysis.variables);
  analysis.variables.map((variable, index) => {
    console.log(index);
    years.map((year) => {
      if (!seriesArray[index]) seriesArray[index] = { type, data: [] };

      seriesArray[index].data.push(hospital[year][index]);
    });
  });

  console.log(seriesArray);

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
          series={seriesArray}
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
