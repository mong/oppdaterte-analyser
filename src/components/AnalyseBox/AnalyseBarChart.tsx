import { Analyse, Lang, Text } from "@/types";
import { BarChart } from "@mui/x-charts/BarChart";
import { regions_dict } from "@/components/AnalyseBox/nameMapping";

type AnalyseBarChartProps = {
  analyse: Analyse;
  year: number;
  level: "region" | "sykehus";
  view: Analyse["views"][number];
  lang: Lang;
};

export const AnalyseBarChart = ({
  analyse,
  year,
  level,
  view,
  lang,
}: AnalyseBarChartProps) => {
  const defaultLabels: { [k: string]: Text[] } = {
    total: [{ no: "Total", en: "Total" }],
  };

  const labels = defaultLabels[view.name] || view.variables;

  const dataset = [];
  for (let area of Object.keys(analyse.data[level])) {
    let datapoint: { area: string; sum: number; [k: number]: number } = {
      area: area,
      sum: 0,
    };

    for (let i = 0; i < Math.max(view.variables?.length || 0, 1); i++) {
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
          valueFormatter: (area) => `${regions_dict[lang][level][area]}`,
        },
      ]}
      series={labels.map((label, i) => ({
        dataKey: i.toString(),
        stack: "stack_group",
        ...(labels.length > 1 && { label: `${label[lang]}` }),
      }))}
      layout="horizontal"
      borderRadius={5}
    />
  );
};
