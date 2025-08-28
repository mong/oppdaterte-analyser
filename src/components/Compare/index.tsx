"use client";

import { Analyse, View } from "@/types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { formatDate, formatNumber } from "@/lib/helpers";
import { regions_dict } from "@/lib/selection";
import { BarChart } from "@mui/x-charts";
import React from "react";

const DiffChart = ({ data }: { data: any }) => {
  const valueFormatter = (value: number | null) =>
    `${formatNumber((value || 0) / 1000, "no", { style: "percent" })}`;
  return (
    <BarChart
      height={500}
      margin={{ left: 120 }}
      layout="horizontal"
      dataset={data}
      yAxis={[{ dataKey: "areaName", scaleType: "band" }]}
      series={[
        {
          stack: "diff",
          dataKey: "neg_diff",
          color: "#E00000",
          label: "Prosent avvik (for lite)",
          valueFormatter,
        },
        {
          stack: "diff",
          dataKey: "pos_diff",
          color: "#FDDA0D",
          label: "Prosent avvik (for mye)",
          valueFormatter,
        },
      ]}
    />
  );
};

type CompareProps = {
  oldAnalyse: Analyse | false;
  newAnalyse: Analyse;
};

enum Severity {
  Message,
  Warning,
  Error,
}

type ReportResults = {
  severity: Severity;
  Elem: ({ depth }: { depth: number }) => React.JSX.Element;
}[];

export const Compare = ({ oldAnalyse, newAnalyse }: CompareProps) => {
  const makeReport = (
    title: string,
    results: ReportResults,
    maxResults: number = 5,
  ): ReportResults => {
    const maxSeverity = results
      .map((r) => r.severity)
      .reduce((prev, curr) => Math.max(prev, curr), Severity.Message);

    const icons = {
      [Severity.Message]: <CheckIcon color="success" />,
      [Severity.Warning]: <WarningIcon color="warning" />,
      [Severity.Error]: <ErrorIcon color="error" fontSize="large" />,
    };

    return [
      {
        severity: maxSeverity,
        Elem: ({ depth }) => {
          const [showAll, setShowAll] = React.useState(false);

          const titleElem = (
            <Typography
              variant={depth === 0 ? "h2" : "h4"}
              sx={{ marginTop: 1, marginBottom: 1 }}
            >
              {title} {icons[maxSeverity]}{" "}
            </Typography>
          );

          return results.length <= 1 || depth === 0 ? (
            <Box sx={{ marginX: 2 }}>
              {titleElem}
              {results.map(({ severity, Elem }, i) => (
                <Elem depth={depth + 1} key={i} />
              ))}
            </Box>
          ) : (
            <Accordion color="primary" disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {titleElem}
              </AccordionSummary>
              <AccordionDetails>
                {results
                  .slice(0, showAll ? Infinity : maxResults)
                  .map(({ severity, Elem }, i) => (
                    <Elem key={i} depth={depth + 1} />
                  ))}
                {results.length > maxResults && (
                  <Box sx={{ marginTop: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={(e) => setShowAll(!showAll)}
                    >
                      {showAll ? "Vis mindre" : "Vis mer"}
                    </Button>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        },
      },
    ];
  };

  const newYears = [
    Math.min(...Object.keys(newAnalyse.data.sykehus[1]).map(Number)),
    Math.max(...Object.keys(newAnalyse.data.sykehus[1]).map(Number)),
  ];

  const newYearsRange = Array.from(
    { length: newYears[1] - newYears[0] + 1 },
    (_, i) => newYears[0] + i,
  );

  const internalIntegrity = newYearsRange.flatMap((year) =>
    ["sykehus", "region"].flatMap((level) =>
      newAnalyse.views
        .filter((view) => view.name !== "total")
        .flatMap((view) => {
          const viewData = Object.keys(newAnalyse.data[level])
            .map((area) => {
              const sum = newAnalyse.data[level][area][year][view.name].reduce(
                (a, b) => a + b,
              );
              const correctSum = newAnalyse.data[level][area][year]["total"][0];
              const raw_diff = (sum / correctSum - 1) * 1000;

              return {
                areaName:
                  regions_dict["no"][level as "sykehus" | "region"][
                    Number(area)
                  ],
                sum,
                correctSum,
                diff: Math.abs(raw_diff),
                neg_diff: Math.abs(Math.min(raw_diff, 0)),
                pos_diff: Math.max(raw_diff, 0),
              };
            })
            .toSorted((a, b) => b.diff - a.diff);

          if (viewData.some((area) => area.diff > 5)) {
            return [
              {
                severity: Severity.Warning,
                Elem: () => (
                  <Box key={`${year}-${level}-${view.name}`}>
                    <Typography variant="h5" sx={{ marginTop: 1 }}>
                      Mulig avvik i {year}, på {level}-nivå, i visningen{" "}
                      {`"${view.name}"`}
                    </Typography>
                    <DiffChart data={viewData}></DiffChart>
                  </Box>
                ),
              },
            ];
          } else return [];
        }),
    ),
  );
  const internalIntegrityReport = makeReport(
    "Intern integritet",
    internalIntegrity.length
      ? internalIntegrity
      : [
          {
            severity: Severity.Message,
            Elem: () => (
              <span>
                Summen av variablene i alle visningene er lik totalen.
              </span>
            ),
          },
        ],
  );

  var externalReports: ReportResults = [];

  if (oldAnalyse) {
    const oldYears = [
      Math.min(...Object.keys(oldAnalyse.data.sykehus[1]).map(Number)),
      Math.max(...Object.keys(oldAnalyse.data.sykehus[1]).map(Number)),
    ];

    const oldTags = new Set(oldAnalyse.tags);
    const newTags = new Set(newAnalyse.tags);
    const oldTagsDiff = oldTags.difference(newTags);
    const newTagsDiff = newTags.difference(oldTags);

    const tagReport = makeReport(
      "Tags",
      oldTagsDiff.size + newTagsDiff.size === 0
        ? [
            {
              severity: Severity.Message,
              Elem: () => <span>Taggene i de to analysene er identiske.</span>,
            },
          ]
        : [
            ...(oldTagsDiff.size > 0
              ? [
                  {
                    severity: Severity.Warning,
                    Elem: () => (
                      <span>
                        Disse taggene finnes bare i den gamle versjonen:{" "}
                        {Array.from(oldTagsDiff).join(", ")}.
                      </span>
                    ),
                  },
                ]
              : []),
            ...(newTagsDiff.size > 0
              ? [
                  {
                    severity: Severity.Warning,
                    Elem: () => (
                      <span>
                        Disse taggene finnes bare i den nye versjonen:{" "}
                        {Array.from(newTagsDiff).join(", ")}.
                      </span>
                    ),
                  },
                ]
              : []),
          ],
    );

    const oldViews = new Set(oldAnalyse.views.map((view) => view.name));
    const newViews = new Set(newAnalyse.views.map((view) => view.name));
    const oldViewsDiff = oldViews.difference(newViews);
    const newViewsDiff = newViews.difference(oldViews);

    const differentVarCount = Array.from(newViews.union(oldViews))
      .flatMap((viewName) => {
        const oldVarcount = oldAnalyse.views.find((v) => v.name === viewName)
          ?.variables.length;
        const newVarcount = newAnalyse.views.find((v) => v.name === viewName)
          ?.variables.length;

        return oldVarcount === newVarcount
          ? []
          : {
              severity: Severity.Warning,
              Elem: () => (
                <span>
                  Visningen {viewName} finnes i begge versjoner, men de har et
                  forskjellig antall variabler (den gamle versjonen har{" "}
                  {oldVarcount}, mens den nye har {newVarcount}). Denne
                  visningen vil derfor ikke bli sjekket for extern integritet.
                </span>
              ),
            };
      })
      .filter(Boolean);

    const viewResults = [
      ...(oldViewsDiff.size > 0
        ? [
            {
              severity: Severity.Warning,
              Elem: () => (
                <span>
                  Disse visningene finnes bare i den gamle versjonen:{" "}
                  {Array.from(oldViewsDiff).join(", ")}.
                </span>
              ),
            },
          ]
        : []),
      ...(newViewsDiff.size > 0
        ? [
            {
              severity: Severity.Warning,
              Elem: () => (
                <span>
                  Disse visningene finnes bare i den nye versjonen:{" "}
                  {Array.from(newViewsDiff).join(", ")}.
                </span>
              ),
            },
          ]
        : []),
    ].concat(differentVarCount);

    const viewReport = makeReport(
      "Visninger",
      (viewResults.length && viewResults) || [
        {
          severity: Severity.Message,
          Elem: () => (
            <span>
              Visningene er de samme i begge versjoner, og visningene har samme
              antall variabler.
            </span>
          ),
        },
      ],
    );

    const yearReport = makeReport(
      "Årstall",
      oldYears.toString() === newYears.toString()
        ? [
            {
              severity: Severity.Message,
              Elem: () => (
                <span>
                  Den nye analysen har data for samme tidsperiode som den gamle
                  analysen: {oldYears.join("–")}
                </span>
              ),
            },
          ]
        : oldYears[0] !== newYears[0] || oldYears[1] + 1 !== newYears[1]
          ? [
              {
                severity: Severity.Warning,
                Elem: () => (
                  <span>
                    Årstallene inkludert i den nye analysen skiller seg på en
                    uvanlig måte fra den gamle.
                  </span>
                ),
              },
              {
                severity: Severity.Warning,
                Elem: () => (
                  <span>
                    Årstall for den gamle analysen: {oldYears.join("–")}.
                  </span>
                ),
              },
              {
                severity: Severity.Warning,
                Elem: () => (
                  <span>
                    Årstall for den nye analysen: {newYears.join("–")}.
                  </span>
                ),
              },
            ]
          : [],
    );

    const ageReport = makeReport(
      "Aldersspenn",
      oldAnalyse.age_range.toString() === newAnalyse.age_range.toString()
        ? [
            {
              severity: Severity.Message,
              Elem: () => (
                <span>
                  Aldersspennet er identiske for begge versjonene:{" "}
                  {oldAnalyse.age_range.join("–")} år.
                </span>
              ),
            },
          ]
        : [
            {
              severity: Severity.Warning,
              Elem: () => (
                <span>
                  Den nye analysen har aldersgruppe{" "}
                  {newAnalyse.age_range.join("–")}, mens den gamle har{" "}
                  {oldAnalyse.age_range.join("–")}.
                </span>
              ),
            },
          ],
    );

    const kjonnReport = makeReport(
      "Kjønn",
      oldAnalyse.kjonn === newAnalyse.kjonn
        ? [
            {
              severity: Severity.Message,
              Elem: () => (
                <span>
                  Kjønn er det samme i begge versjoner ({oldAnalyse.kjonn}).
                </span>
              ),
            },
          ]
        : [
            {
              severity: Severity.Warning,
              Elem: () => (
                <span>
                  Den nye analysen har kjønn {newAnalyse.kjonn}, mens den gamle
                  har {oldAnalyse.kjonn}.
                </span>
              ),
            },
          ],
    );

    const generertReport = makeReport(
      "Genereringstidspunkt",
      oldAnalyse.generated > newAnalyse.generated
        ? [
            {
              severity: Severity.Error,
              Elem: () => (
                <span>
                  Den nye analysen ble generert i SAS før den gamle analysen.
                  Den gamle versjonen ble generert{" "}
                  {formatDate(new Date(oldAnalyse.generated), "no")}, mens den
                  nye versjonen ble generert{" "}
                  {formatDate(new Date(newAnalyse.generated), "no")}.
                </span>
              ),
            },
          ]
        : oldAnalyse.generated === newAnalyse.generated
          ? [
              {
                severity: Severity.Warning,
                Elem: () => (
                  <span>
                    Den gamle og den nye versjonen ble generert i SAS på samme
                    tidspunkt (
                    {formatDate(new Date(newAnalyse.generated), "no")}).
                  </span>
                ),
              },
            ]
          : [
              {
                severity: Severity.Message,
                Elem: () => (
                  <span>
                    Den nye analysen ble generert i SAS etter den gamle.
                  </span>
                ),
              },
            ],
    );

    const identicalViews = Array.from(newViews.union(oldViews)).filter(
      (viewName) =>
        oldAnalyse.views.find((v) => v.name === viewName)?.variables.length ===
        newAnalyse.views.find((v) => v.name === viewName)?.variables.length,
    );

    const commonYears = [
      Math.max(newYears[0], oldYears[0]),
      Math.min(newYears[1], oldYears[1]),
    ];
    const commonYearsRange = Array.from(
      { length: commonYears[1] - commonYears[0] + 1 },
      (_, i) => commonYears[0] + i,
    );

    const externalIntegrity = commonYearsRange.flatMap((year) =>
      ["sykehus", "region"].flatMap((level) =>
        identicalViews.flatMap((viewName) => {
          const view = newAnalyse.views.find(
            (v) => v.name === viewName,
          ) as View;
          return view.variables.flatMap((variable, i) => {
            const graphData = Object.keys(oldAnalyse.data[level])
              .map((area) => {
                const oldValue =
                  oldAnalyse.data[level][area][year][viewName][i];
                const newValue =
                  newAnalyse.data[level][area][year][viewName][i];
                const raw_diff = (newValue / oldValue - 1) * 1000 || 0;

                return {
                  areaName:
                    regions_dict["no"][level as "sykehus" | "region"][
                      Number(area)
                    ],
                  oldValue: oldValue,
                  newValue: newValue,
                  diff: Math.abs(raw_diff),
                  neg_diff: Math.abs(Math.min(raw_diff, 0)),
                  pos_diff: Math.max(raw_diff, 0),
                };
              })
              .toSorted((a, b) => b.diff - a.diff);

            if (graphData.some((data) => data.diff > 0)) {
              return [
                {
                  severity: graphData.some(
                    (data) => data.diff > 100 /* more than 10% difference */,
                  )
                    ? Severity.Error
                    : Severity.Warning,
                  Elem: () => (
                    <Box key={`${year}-${level}-${viewName}-${i}`}>
                      <Typography variant="h5" sx={{ marginTop: 1 }}>
                        Mulig avvik i {year}, i visningen {viewName}, for
                        variabelen {variable.no}
                      </Typography>
                      <DiffChart data={graphData} />
                    </Box>
                  ),
                },
              ];
            } else return [];
          });
        }),
      ),
    );
    const externalIntegrityReport = makeReport(
      "Extern integritet",
      externalIntegrity.length
        ? externalIntegrity
        : [
            {
              severity: Severity.Message,
              Elem: () => (
                <span>
                  Variablene i den gamle og nye analysen har samme verdi for
                  årene de deler.
                </span>
              ),
            },
          ],
    );

    externalReports = makeReport(
      "Sammenligning med publisert versjon",
      tagReport.concat(
        viewReport,
        yearReport,
        ageReport,
        kjonnReport,
        generertReport,
        externalIntegrityReport,
      ),
      Infinity,
    );
  }
  const OuterReport = makeReport(
    "Integritetssjekk",
    internalIntegrityReport.concat(oldAnalyse ? externalReports : []),
    Infinity,
  )[0].Elem;

  return <OuterReport depth={0} />;
};
