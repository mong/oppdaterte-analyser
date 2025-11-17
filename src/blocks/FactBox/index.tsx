"use client";

import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Box } from "@mui/material";

type FactBoxProps = {
  text: React.JSX.Element;
  title: string;
};

export const FactBox = ({
  text,
  title,
}: FactBoxProps) => {
  const [expanded, setExpanded] =
    React.useState<boolean>(false);


  return (
    <Accordion
      type="single"
      collapsible
      value={expanded ? "open" : "closed"}
    >
      <AccordionItem
        value="open"
        className="w-full m-0 p-0"
      >
        <AccordionTrigger
          onClick={() => setExpanded(!expanded)}
          className="bg-[#E6EEF8] cursor-pointer p-4 m-0 text-[#033F85] hover:bg-[rgba(3,69,132,0.2)]"
        >
          {title}
        </AccordionTrigger>
        <AccordionContent
          className="bg-[#FAFAFA] p-0 m-0"
        >
          <div>
            rgd
            {text}
            bf
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
