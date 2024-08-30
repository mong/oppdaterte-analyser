import { Analyse } from "@/app/models/AnalyseModel";
import { BarChart } from "@mui/x-charts/BarChart";
import { names } from "@/app/components/AnalyseBox/nameMapping";

type AnalyseBarChartProps = {
  analyse: Analyse;
  year: number;
  level: "region" | "sykehus";
  view: Analyse["views"][number];
};

export const AnalyseBarChart = ({
  analyse,
  year,
  level,
  view,
}: AnalyseBarChartProps) => {
  console.log(analyse, year, level, view);

  const defaultLabels: { [k: string]: [{ [k: string]: string }] } = {
    total: [{ no: "Total", en: "Total" }],
  };

  const labels = defaultLabels[view.view] || view.labels;

  const dataset = [];
  for (let area of Object.keys(analyse.data[level])) {
    let datapoint: { area: string; sum: number; [k: number]: number } = {
      area: area,
      sum: 0,
    };

    for (let i = 0; i < Math.max(view.labels?.length || 0, 1); i++) {
      datapoint[i] = analyse.data[level][area][year][0][i];
      datapoint.sum += datapoint[i];
    }
    dataset.push(datapoint);
  }
  dataset.sort((a, b) => b.sum - a.sum);

  return (
    <BarChart
      margin={{ left: 120 }}
      dataset={dataset}
      yAxis={[
        {
          scaleType: "band",
          dataKey: "area",
          tickPlacement: "middle",
          valueFormatter: (area) => `${names[level][area]}`,
        },
      ]}
      series={labels.map((label, i) => ({
        dataKey: i.toString(),
        label: `${i}`,
        stack: "stack_group",
      }))}
      layout="horizontal"
      borderRadius={5}
    />
  );
};
