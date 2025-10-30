import React from "react";
import { LineChart } from "@mui/x-charts";
import { Lang } from "@/types";
import { formatNumber } from "@/lib/helpers";
import { Analyser } from "@/payload-types";

type AnalyseDemographyProps = {
  analyse: Analyser["data"];
  year: number | "all_years";
  years: number[];
  showGenders: boolean;
  andel: boolean;
  lang: Lang;
  variable: { viewName: string; name: string };
};

const AnalyseDemography = ({
  analyse,
  year,
  years,
  andel,
  lang,
  showGenders,
  variable,
}: AnalyseDemographyProps) => {
  const aldre = Array.from(
    { length: analyse.age_range[1] - analyse.age_range[0] + 1 },
    (_, i) => analyse.age_range[0] + i,
  );

  const demographyData = React.useMemo(() => {
    const data = Object.fromEntries(
      years.map((year) => [
        year,
        aldre.map((alder) => {
          const kvinner =
            analyse.data.demografi[year][variable.viewName][alder][
              variable.name
            ]["kvinner"];
          const kvinner_pop =
            analyse.data.demografi[year]["population"][alder]["population"][
              "kvinner"
            ];
          const menn =
            analyse.data.demografi[year][variable.viewName][alder][
              variable.name
            ]["menn"];
          const menn_pop =
            analyse.data.demografi[year]["population"][alder]["population"][
              "menn"
            ];

          return {
            alder: alder,
            ...(analyse.kjonn !== "menn" && {
              kvinner: kvinner,
              kvinner_andel: (kvinner / kvinner_pop) * 100,
            }),
            ...(analyse.kjonn !== "kvinner" && {
              menn: menn,
              menn_andel: (menn / menn_pop) * 100,
            }),
            ...(analyse.kjonn === "begge" && {
              begge: kvinner + menn,
              begge_andel: ((kvinner + menn) / (kvinner_pop + menn_pop)) * 100,
            }),
          };
        }),
      ]),
    );
    const average = aldre.map((alder) => {
      const kvinner = years
        .map(
          (year) =>
            analyse.data.demografi[year][variable.viewName][alder][
              variable.name
            ]["kvinner"],
        )
        .reduce((a, b) => a + b, 0);
      const kvinner_pop = years
        .map(
          (year) =>
            analyse.data.demografi[year]["population"][alder]["population"][
              "kvinner"
            ],
        )
        .reduce((a, b) => a + b, 0);
      const menn = years
        .map(
          (year) =>
            analyse.data.demografi[year][variable.viewName][alder][
              variable.name
            ]["menn"],
        )
        .reduce((a, b) => a + b, 0);
      const menn_pop = years
        .map(
          (year) =>
            analyse.data.demografi[year]["population"][alder]["population"][
              "menn"
            ],
        )
        .reduce((a, b) => a + b, 0);

      return {
        alder: alder,
        ...(analyse.kjonn !== "menn" && {
          kvinner: kvinner / years.length,
          kvinner_andel: (kvinner / kvinner_pop) * 100,
        }),
        ...(analyse.kjonn !== "kvinner" && {
          menn: menn / years.length,
          menn_andel: (menn / menn_pop) * 100,
        }),
        ...(analyse.kjonn === "begge" && {
          begge: (kvinner + menn) / years.length,
          begge_andel: ((kvinner + menn) / (kvinner_pop + menn_pop)) * 100,
        }),
      };
    });

    return { ...data, all_years: average } as {
      [k: string]: { [k: string]: number }[];
    };
  }, [analyse, years, variable]);

  const maxValues = React.useMemo(
    () =>
      Object.fromEntries(
        [
          ...(analyse.kjonn !== "menn" ? ["kvinner", "kvinner_andel"] : []),
          ...(analyse.kjonn !== "kvinner" ? ["menn", "menn_andel"] : []),
          ...(analyse.kjonn === "begge" ? ["begge", "begge_andel"] : []),
        ].map((key) => [
          key,
          Math.max(
            ...years.map((year) =>
              Math.max(...demographyData[year].map((d) => d[key]!)),
            ),
          ),
        ]),
      ),
    [analyse, years],
  );

  const andelOrAntall = andel ? "andel" : "antall";
  const dataKeys = {
    andel: {
      kvinner: "kvinner_andel",
      menn: "menn_andel",
      begge: "begge_andel",
    },
    antall: {
      kvinner: "kvinner",
      menn: "menn",
      begge: "begge",
    },
  };

  return (
    <LineChart
      dataset={demographyData[year]}
      xAxis={[
        {
          scaleType: "point",
          dataKey: "alder",
          tickInterval: (value) =>
            value % Math.floor(Math.max(1, aldre.length / 20)) === 0,
          valueFormatter: (value, context) =>
            value +
            (context.location === "tooltip"
              ? { no: " år", en: " years" }[lang]
              : ""),
        },
      ]}
      yAxis={[
        {
          min: 0,
          max:
            (showGenders
              ? Math.max(
                  (["begge", "kvinner"].includes(analyse.kjonn) &&
                    maxValues[dataKeys[andelOrAntall]["kvinner"]]) ||
                    0,
                  (["begge", "menn"].includes(analyse.kjonn) &&
                    maxValues[dataKeys[andelOrAntall]["menn"]]) ||
                    0,
                )
              : maxValues[dataKeys[andelOrAntall]["begge"]]) * 1.01,
          valueFormatter: (value: number | null) =>
            andel
              ? formatNumber((value || 0) / 100, lang, { style: "percent" })
              : formatNumber(value || 0, lang),
        },
      ]}
      series={(showGenders
        ? [
            ...((["begge", "kvinner"].includes(analyse.kjonn) && [
              { dataKey: dataKeys[andelOrAntall]["kvinner"], label: "Kvinner" },
            ]) ||
              []),
            ...((["begge", "menn"].includes(analyse.kjonn) && [
              { dataKey: dataKeys[andelOrAntall]["menn"], label: "Menn" },
            ]) ||
              []),
          ]
        : [{ dataKey: dataKeys[andelOrAntall]["begge"], label: "Begge kjønn" }]
      ).map((series, i) => ({
        ...series,
        showMark: false,
        baseline: "min",
        color: ["#00509E", "#95BDE6"][i],
        valueFormatter: (value: number | null) =>
          andel
            ? formatNumber((value || 0) / 100, lang, { style: "percent" })
            : formatNumber(value || 0, lang, { maximumFractionDigits: 0 }),
      }))}
      margin={{
        left: 60,
        top: 60,
        bottom: 25,
      }}
      slotProps={{
        legend: {
          itemMarkHeight: 5,
          itemMarkWidth: 17,
          hidden: !showGenders || analyse.kjonn !== "begge",
        },
      }}
      sx={{
        "& .MuiLineElement-root": {
          strokeWidth: "3px",
        },
      }}
    />
  );
};

export default AnalyseDemography;
