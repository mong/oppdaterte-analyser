"use client";

import React from "react";

import { Accordion, AccordionItem } from "@mong/material-ui";

type FactBoxProps = {
  text: React.JSX.Element;
  title: string;
};

export const FactBox = ({
  text,
  title,
}: FactBoxProps) => {

  return (
    <div className="my-4" /*hover:[&:hover]:bg-brand-primary-50"*/ >
      <Accordion
        gap="2"
        variant="text"
      >
        <AccordionItem
          title={title}
          variant="text"
        >
          <div className="w-full">
            {text}
          </div>
        </AccordionItem>
      </Accordion>
    </div>

  );
};
