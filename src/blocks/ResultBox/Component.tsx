import type { ResultBoxBlock as ResultBoxBlockProps } from "src/payload-types";

import React from "react";
import RichText from "@/components/RichText";

import { promises as fs } from "fs";

import { ResultBox } from ".";

export const ResultBoxBlock: React.FC<ResultBoxBlockProps> = async ({
  kart,
  oppsummering,
  diskusjon,
  utvalg,
  media,
  blockName,
}) => {
  if (!media || !(typeof media === "object") || !media.url || !media.filename)
    return;
  if (!kart || !(typeof kart === "object") || !kart.filename) return;

  const getPath = (filename: string) =>
    `${process.cwd()}/public/data/${filename}`;

  // Promise.all to read both files concurrently
  const [mapData, data] = await Promise.all([
    fs.readFile(getPath(kart.filename), "utf8"),
    fs.readFile(getPath(media.filename), "utf8"),
  ]);

  const parsedMapData = JSON.parse(mapData);
  const parsedData = JSON.parse(data);

  return (
    <ResultBox
      title={blockName || "Uten tittel"}
      boxData={parsedData.innhold}
      mapData={parsedMapData}
      summary={
        <RichText
          data={oppsummering}
          enableGutter={false}
          enableProse={false}
        />
      }
      discussion={
        <RichText data={diskusjon} enableGutter={false} enableProse={false} />
      }
      utvalg={
        <RichText data={utvalg} enableGutter={false} enableProse={false} />
      }
    />
  );
};
