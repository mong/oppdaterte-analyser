import type { TableBlock as TableBlockProps } from "src/payload-types";

import React from "react";
import RichText from "@/components/RichText";


export const TableBlock: React.FC<TableBlockProps> = async ({
  table,
  caption
}) => {


  return (
    <div>
      <div className="leading-none">
        <RichText
          data={table}
          enableGutter={false}
          enableProse={false}
        />
      </div>
      {caption && (
        <div className='mt-6 mx-auto max-w-3xl'>
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  );
};
