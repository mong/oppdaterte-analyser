"use client";
import * as React from "react";
import {
  ResponsiveChartContainer,
  BarPlot,
  ChartsXAxis,
  LinePlot,
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
  analysis.variables.map((variable, index) => {
    years.map((year) => {
      if (!seriesArray[index]) seriesArray[index] = { type, data: [] };
      seriesArray[index].data.push(hospital[year][index]);
    });
  });

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  return (
    <Box sx={{ width: "100%" }}>
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
              value={"line"}
              key={`chart-select-line-${analysis._id}`}
              id={`chart-select-line-${analysis._id}`}
            >
              Linje
            </MenuItem>
            <MenuItem
              value={"bar"}
              key={`chart-select-bar-${analysis._id}`}
              id={`chart-select-bar-${analysis._id}`}
            >
              Søyle
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
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
      </Box>
    </Box>
  );
}
