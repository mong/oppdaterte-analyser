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

export interface AnalysisDataGroupPlain {
  [key: string]: number[];
}

export interface ChartSeriesArray {
  keys: string[];
  series: ChartSeriesType[];
}

const getSeriesKeys = (
  group: AnalysisDataGroup | AnalysisDataGroupPlain,
): string[] => {
  return Object.keys(group);
};

export const toSeriesArray = (
  group: AnalysisDataGroup,
  variables: string[],
  type: ChartTypeString,
): ChartSeriesArray => {
  const numVars = variables.length;
  const seriesKeys = getSeriesKeys(group);
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

export const sumVariables = (
  group: AnalysisDataGroupPlain,
): AnalysisDataGroupPlain => {
  const seriesKeys = getSeriesKeys(group);

  const result: AnalysisDataGroupPlain = {};

  seriesKeys.map((key) => {
    const sum = group[key].reduce(
      (accumulator, current) => accumulator + current,
    );
    result[key] = [sum];
  });

  return result;
};
