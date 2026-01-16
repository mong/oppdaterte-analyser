"use client";

import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BsCaretDownFill } from "react-icons/bs";

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
      className="mt-4"
    >
      <AccordionItem
        value="open"
        className="w-full m-0 p-0 border-b-2 border-b-solid border-b-[rgb(3,63,133)] shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
      >
        <AccordionTrigger
          onClick={() => setExpanded(!expanded)}
          className="bg-[#E6EEF8] cursor-pointer p-4 m-0 text-[#033F85] hover:bg-[rgba(3,69,132,0.2)] font-semibold text-[1rem]"
        >
          {title}
          <BsCaretDownFill color="#033F85" fontSize="large" />
        </AccordionTrigger>
        <AccordionContent className="bg-[#FAFAFA] p-4">
          {text}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
