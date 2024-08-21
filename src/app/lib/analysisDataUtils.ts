import {
  LineSeriesType,
  BarSeriesType,
  ScatterSeriesType,
  PieSeriesType,
  PieValueType,
  ScatterValueType,
} from "@mui/x-charts";
import { MakeOptional, ChartSeries } from "@mui/x-charts/internals";

export type ChartSeriesType =
  | LineSeriesType
  | BarSeriesType
  | ScatterSeriesType
  | PieSeriesType<MakeOptional<PieValueType, "id">>;

export type ChartSeriesValueType = number &
  ScatterValueType &
  Omit<PieValueType, "id"> &
  Partial<Pick<PieValueType, "id">>;

export type ChartTypeString = "line" | "bar" | "scatter" | "pie";

export interface AnalysisDataGroup {
  [key: string]: ChartSeriesValueType[];
}

export interface ChartSeriesArray {
  keys: string[];
  series: ChartSeriesType[];
}

export const toSeriesArray = (
  group: AnalysisDataGroup,
  variables: string[],
  type: ChartTypeString,
): ChartSeriesArray => {
  const numVars = variables.length;
  const seriesKeys = Object.keys(group);
  const seriesArray: ChartSeriesArray = {
    keys: seriesKeys,
    series: Array<ChartSeriesType>(numVars),
  };

  variables.map((variable, index) => {
    seriesKeys.map((key) => {
      if (!seriesArray.series[index])
        seriesArray.series[index] = { type, data: [] };
      seriesArray.series[index].data?.push(group[key][index]);
    });
  });

  return seriesArray;
};
