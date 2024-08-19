"use client";
import * as React from "react";
import { ResponsiveChartContainer, BarPlot } from "@mui/x-charts";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";

export default function AnalysisBoxCharts() {
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
      display="flex"
      justifyContent="center"
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
