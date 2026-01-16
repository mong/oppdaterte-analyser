import type { ResultBoxBlock as ResultBoxBlockProps } from "src/payload-types";

import React from "react";
import RichText from "@/components/RichText";

import { ResultBox } from ".";
import { getServerSideURL } from "@/utilities/getURL";

export const ResultBoxBlock: React.FC<ResultBoxBlockProps & { lang?: "en" | "nb" | "nn" }> = async ({
  kart,
  lang,
  oppsummering,
  diskusjon,
  utvalg,
  media,
  blockName,
}) => {
  if (!media || !(typeof media === "object") || !media.url || !media.filename)
    return;
  if (!kart || !(typeof kart === "object") || !kart.filename) return;

  const url = getServerSideURL();

  // Promise.all to read both files concurrently
  const [mapData, data] = await Promise.all([
    fetch(`${url}/api/datafiler/file/${kart.filename}`).then((res) => res.json()),
    fetch(`${url}/api/datafiler/file/${media.filename}`).then((res) => res.json()),
  ]);


  return (
    <ResultBox
      lang={lang || "nb"}
      title={blockName || "Uten tittel"}
      boxData={data.innhold}
      mapData={mapData}
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
