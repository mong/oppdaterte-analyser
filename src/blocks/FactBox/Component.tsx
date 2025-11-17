import type { FactBoxBlock as FactBoxBlockProps } from "src/payload-types";

import React from "react";
import RichText from "@/components/RichText";

import { FactBox } from ".";

export const FactBoxBlock: React.FC<FactBoxBlockProps> = async ({
  text,
  blockName,
}) => {

  return (
    <FactBox
      title={blockName || "Uten tittel"}
      text={
        <RichText
          data={text}
          enableGutter={false}
          enableProse={false}
        />
      }
    />
  );
};
