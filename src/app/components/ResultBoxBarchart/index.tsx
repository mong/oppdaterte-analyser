"use client";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import Paper from "@mui/material/Paper";
import { ThemeContext } from "@emotion/react";

export default function ChartsOverviewDemo() {
  return (
    <Paper sx={{ width: "100%", height: 300 }} elevation={3}>
      <ResponsiveChartContainer
        series={[{ type: "bar", data: [35, 44, 24, 34, 40] }]}
        xAxis={[
          {
            data: ["A", "B", "C", "D", "E"],
            scaleType: "band",
            id: "x-axis-id",
          },
        ]}
      >
        <BarPlot margin={{ top: 10, bottom: 10, left: 40, right: 40 }} />
        <ChartsXAxis label="X axis" position="bottom" axisId="x-axis-id" />
      </ResponsiveChartContainer>
    </Paper>
  );
}
