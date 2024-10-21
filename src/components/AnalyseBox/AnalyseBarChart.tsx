import { Analyse, Lang, Text } from "@/types";
import { BarChart, BarElementPath } from "@mui/x-charts/BarChart";
import { regions_dict, Selection } from "@/lib/nameMapping";
import { ChartsText } from "@mui/x-charts/ChartsText";

type AnalyseBarChartProps = {
  analyse: Analyse;
  year: number;
  level: "region" | "sykehus";
  view: number;
  lang: Lang;
  selection: Selection;
  onClick: (n: number) => any;
};

export const AnalyseBarChart = ({
  analyse,
  year,
  level,
  view,
  lang,
  selection,
  onClick,
}: AnalyseBarChartProps) => {
  const defaultLabels: { [k: string]: Text[] } = {
    total: [{ no: "Total", en: "Total" }],
  };

  const viewData = analyse.views[view];

  const labels = defaultLabels[viewData.name] || viewData.variables;

  const dataset = [];
  for (let area of Object.keys(analyse.data[level])) {
    let datapoint: { area: string; sum: number; [k: number]: number } = {
      area: area,
      sum: 0,
    };

    for (let i = 0; i < Math.max(viewData.variables?.length || 0, 1); i++) {
      datapoint[i] = analyse.data[level][area][year][view][i];
      datapoint.sum += datapoint[i];
    }
    dataset.push(datapoint);
  }
  dataset.sort((a, b) => b.sum - a.sum);
  const dataIndexToArea = Object.fromEntries(
    dataset.map((bar, i) => [i, Number(bar.area)]),
  );
  const nameToArea = Object.fromEntries(
    dataset.map((bar) => [
      regions_dict[lang][level][Number(bar.area)],
      Number(bar.area),
    ]),
  );

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
      slots={{
        axisTickLabel: (props) => {
          const selected =
            props.text in nameToArea &&
            selection[level].includes(nameToArea[props.text]);
          return (
            <ChartsText
              {...props}
              style={{
                ...props.style,
                fontWeight: selected ? "bold" : "normal",
              }}
            />
          );
        },
        bar: ({ ownerState, ...otherProps }) => (
          <BarElementPath
            {...otherProps}
            ownerState={{
              ...ownerState,
              color:
                dataIndexToArea[ownerState.dataIndex] === 8888
                  ? `rgba(120, 120, 140, ${0.85 * 0.65 ** Number(ownerState.id)})` // ownerState.id = series ID
                  : selection[level].includes(
                        dataIndexToArea[ownerState.dataIndex],
                      )
                    ? `rgba(16, 100, 205, ${0.85 * 0.65 ** Number(ownerState.id)})`
                    : `rgba(46, 150, 255, ${0.85 * 0.65 ** Number(ownerState.id)})`,
            }}
          />
        ),
      }}
      series={labels.map((label, i) => ({
        dataKey: i.toString(),
        id: `${i}`,
        stack: "stack_group",
        color: `rgba(46, 150, 255, ${0.85 * 0.65 ** i})`,
        ...(labels.length > 1 && { label: `${label[lang]}` }),
      }))}
      onAxisClick={(event, params) => onClick(Number(params?.axisValue))}
      layout="horizontal"
      borderRadius={5}
    />
  );
};
