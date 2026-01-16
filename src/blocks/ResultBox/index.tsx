"use client";

import { Abacus } from "./Charts/Abacus";
import { AtlasDataItem, BarchartItem, DataItemPoint } from "./types";
import classNames from "./ResultBox.module.css";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Box } from "@mui/material";
import Carousel from "./Charts/Carousel";
import { Barchart } from "./Charts/Barchart";
import { Linechart } from "./Charts/Linechart";
import { DataTable } from "./Charts/Table";
import { Map } from "./Charts/Map";

type ResultBoxProps = {
  boxData: AtlasDataItem[];
  title: string;
  summary: React.JSX.Element;
  discussion: React.JSX.Element;
  utvalg: React.JSX.Element;
  mapData: any;
  lang: "en" | "nb" | "nn";
};

export const ResultBox = ({
  boxData,
  title,
  summary,
  lang="nb",
  discussion,
  utvalg,
  mapData,
}: ResultBoxProps) => {
  const [expandedResultBox, setExpandedResultBox] =
    React.useState<boolean>(false);

  if (!boxData || !boxData.length) {
    return;
  }

  const areaName = (boxData[0] as BarchartItem).yLabel[lang] as string;
  const areaType = (
    {
      Opptaksområde: "area",
      Opptaksområder: "area",
      "Referral areas": "area",
      Fylker: "county",
    }[areaName] ||
    areaName ||
    "area"
  ).toLowerCase();

  const charts = boxData.filter((dataItem) => dataItem.type !== "data");

  const nationalName = boxData.find((o) => o.type === "data")!["national"];

  const chartElems = charts.map((dataItem, i) => {
    const figData = boxData.find(
      (item) => item.type === "data" && item.label === dataItem.data,
    )!["data"] as DataItemPoint[];
    if (dataItem.type === "barchart") {
      return (
        <Barchart
          {...dataItem}
          data={figData}
          lang={lang}
          national={nationalName}
          areaType={areaType}
          forfatter={"SKDE"}
        />
      );
    } else if (dataItem.type === "linechart") {
      return (
        <Linechart
          {...dataItem}
          data={figData}
          lang={lang}
          national={nationalName}
          forfatter={"SKDE"}
        />
      );
    } else if (dataItem.type === "table") {
      return (
        <DataTable
          headers={dataItem.columns}
          data={figData}
          caption={dataItem.caption[lang]}
          areaType={areaType}
          lang={lang}
          national={nationalName}
        />
      );
    } else {
      return (
        <Map
          mapData={mapData}
          jenks={dataItem.jenks.map((j) => j.grense)}
          attrName={dataItem.x as string}
          data={figData}
          format={dataItem.format}
          caption={dataItem.caption[lang]}
          areaType={areaType}
          lang={lang}
        />
      );
    }
  });

  const abacusX = boxData.find((boxd) => boxd.type === "map")!.x;
  const figData = boxData.find((o) => o.type === "data")!["data"];

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        value={expandedResultBox ? "open" : "closed"}
      >
        <AccordionItem
          value="open"
          className="mt-8 shadow-[0_5px_15px_rgba(0,0,0,0.25)] border-b-[0.1875rem] border-primary"
        >
          <Box
            onClick={() => setExpandedResultBox(!expandedResultBox)}
            sx={{
              backgroundColor: "#FAFAFA",
              padding: 2,
              fontSize: "1.1rem",
              ":hover": {
                backgroundColor: "rgb(241, 241, 241)",
                transition: "200ms ease-in",
                cursor: "pointer",
              },
            }}
          >
            <div className={classNames.resultBoxTitleWrapper}>
              <h3 className="text-xl font-bold mb-4">{title}</h3>
              {summary}
              {figData && (
                <Abacus
                  data={figData}
                  lang={lang}
                  x={abacusX}
                  label={(boxData[0] as BarchartItem).xLabel[lang]}
                  areaType={areaType}
                  areaName={areaName}
                  format={(boxData[0] as BarchartItem).format}
                  national={nationalName}
                />
              )}
            </div>
          </Box>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <Box
              sx={{
                backgroundColor: "#FAFAFA",
              }}
            >
              <Carousel
                chartElems={chartElems}
                utvalg={utvalg}
                boxData={boxData}
                lang={lang}
              />
              <div className={classNames.resultBoxSelectionContent}>
                {discussion}
              </div>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div
        className={classNames.crossWrapper}
        role="button"
        aria-label="Open"
        onClick={() => setExpandedResultBox(!expandedResultBox)}
      >
        <span className={classNames.horizontal} />
        {!expandedResultBox && <span className={classNames.vertical} />}
      </div>
    </div>
  );
};
