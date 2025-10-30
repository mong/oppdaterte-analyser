"use client";

import React, { ActionDispatch, Context, createContext, useContext, useReducer } from 'react';

export const SelectionContext: Context<Selection> = createContext({});
export const ToggleSelectionContext = createContext<ActionDispatch<[area: { areaType: string; name: string; }]>>(() => null);

export type Selection = {
  [areaType: string]: Set<string>;
};

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, dispatch] = useReducer(
    selectionReducer,
    {}
  );

  return (
    <SelectionContext value={selection}>
      <ToggleSelectionContext value={dispatch}>
        {children}
      </ToggleSelectionContext>
    </SelectionContext>
  );
}


const borhf: { [k: string]: string[] } = {
  "Helse Sør-Øst": [
    "Akershus",
    "OUS",
    "Vestfold",
    "Vestre Viken",
    "Sørlandet",
    "Telemark",
    "Innlandet",
    "Østfold",
    "Diakonhjemmet",
    "Lovisenberg",
  ],
  "Helse Vest": ["Førde", "Bergen", "Fonna", "Stavanger"],
  "Helse Midt-Norge": ["St. Olav", "Møre og Romsdal", "Nord-Trøndelag"],
  "Helse Nord": ["Finnmark", "UNN", "Nordland", "Helgeland"],
};
const borhfSet = new Set(Object.keys(borhf));


function selectionReducer(selection: Selection, area: { areaType: string, name: string }): Selection {
  const newSelection = new Set(selection[area.areaType]);

  if (newSelection.has(area.name)) {
    newSelection.delete(area.name);
    if (borhfSet.has(area.name)) {
      for (const b of borhf[area.name]) {
        newSelection.delete(b);
      }
    }
  } else {
    newSelection.add(area.name);
    if (borhfSet.has(area.name)) {
      for (const b of borhf[area.name]) {
        newSelection.add(b);
      }
    }
  }

  for (const [rhf, bohfs] of Object.entries(borhf)) {
    newSelection.delete(rhf);
    if (bohfs.every((area) => newSelection.has(area)))
      newSelection.add(rhf);
  }
  return { ...selection, [area.areaType]: newSelection };
}

export function useSelection(areaType: string, national: string) {
  const toggleSelection = useContext(ToggleSelectionContext);
  return {
    selection: useContext(SelectionContext)[areaType] || new Set<string>(),
    toggleSelection: (areaName: string) => areaName !== national && toggleSelection({ areaType, name: areaName }),
  };
}
