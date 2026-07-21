"use client";

import { Abacus } from "./Charts/Abacus";
import { AtlasDataItem, BarchartItem, DataItemPoint } from "./types";
import React from "react";


import { Accordion, AccordionItem } from "@mong/material-ui";

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
  author: "SKDE" | "Helse Førde";
};

export const ResultBox = ({
  boxData,
  title,
  summary,
  lang = "nb",
  author,
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
          forfatter={author}
        />
      );
    } else if (dataItem.type === "linechart") {
      return (
        <Linechart
          {...dataItem}
          data={figData}
          lang={lang}
          national={nationalName}
          forfatter={author}
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
    <div className="py-4">
    <Accordion
      gap="2"
      type="collapseOthers"
      variant="compact"
    >
      <AccordionItem
        showIcon={false}
        title={(
          <div className="py-7.5 px-5 text-black">
            <div className="not-prose">
              <h5 className="text-xl font-bold mb-4">{title}</h5>
            </div>
            <div className="prose max-w-none">{summary}</div>
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
        )}
        variant="compact"
      >
        <Carousel
          chartElems={chartElems}
          utvalg={utvalg}
          boxData={boxData}
          lang={lang}
        />
        <div className="py-7.5 px-5">
          {discussion}
        </div>
      </AccordionItem>
    </Accordion>
    </div>
  );
};
