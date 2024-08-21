"use client";
import * as React from "react";
import {
  ResponsiveChartContainer,
  BarPlot,
  ChartsXAxis,
  LinePlot,
  AllSeriesType,
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
import { ChartTypeString, toSeriesArray } from "@/app/lib/analysisDataUtils";

interface AnalysisBoxChartsProps {
  analysis: Analysis;
  lang: string;
}

export default function AnalysisBoxCharts({
  analysis,
  lang,
}: AnalysisBoxChartsProps) {
  const [type, setType] = React.useState<ChartTypeString>("line");

  const hospital: any = analysis.data.sykehus["15"];
  const seriesArray = toSeriesArray(hospital, analysis.variables, type);

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as ChartTypeString);
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
          series={seriesArray.series}
          xAxis={[
            {
              data: seriesArray.keys,
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
