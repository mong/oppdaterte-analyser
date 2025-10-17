"use server";
import type { ResultBoxBlock as ResultBoxBlockProps } from 'src/payload-types'

import React from 'react'
import RichText from '@/components/RichText'

import { promises as fs } from 'fs';


import { ResultBox } from ".";

export const ResultBoxBlock: React.FC<ResultBoxBlockProps> = async ({ kart, diskusjon, utvalg, media, blockName }) => {
  if (!media || typeof media === "string" || !media.url || !media.filename) return
  if (!kart || typeof kart === "string" || !kart.filename) return

  const getPath = (filename: string) => `${process.cwd()}/public/data/${filename}`

  const mapData = JSON.parse(await fs.readFile(getPath(kart.filename), 'utf8'));
  const data = JSON.parse(await fs.readFile(getPath(media.filename), 'utf8'));

  return (
    <ResultBox
      title={blockName || "Uten tittel"}
      boxData={data.innhold}
      mapData={mapData}
      discussion={<RichText data={diskusjon} enableGutter={false} enableProse={false} />}
      utvalg={<RichText data={utvalg} enableGutter={false} enableProse={false} />}
    />
  )
}
