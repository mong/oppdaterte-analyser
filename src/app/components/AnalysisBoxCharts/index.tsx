"use client";
import * as React from "react";
import { ResponsiveChartContainer, BarPlot } from "@mui/x-charts";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import { IAnalysis } from "@/app/models/AnalysisModel";
import { ICompendium } from "@/app/models/CompendiumModel";

interface AnalysisBoxChartsProps {
  analysis: IAnalysis;
  lang: string;
}

export default function AnalysisBoxCharts({
  analysis,
  lang,
}: AnalysisBoxChartsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        width: "100%",
        height: "50vh",
        maxWidth: "1000px",
        [theme.breakpoints.down("sm")]: {
          height: "40vh",
        },
      }}
    >
      {/* @ts-ignore */}
      <ResponsiveChartContainer
        xAxis={[
          {
            id: "barCategories",
            data: ["bar A", "bar B", "bar C"],
            scaleType: "band",
          },
        ]}
        series={[
          {
            type: "bar",
            data: [2, 5, 3],
          },
        ]}
      >
        <BarPlot />
      </ResponsiveChartContainer>
    </Box>
  );
}
