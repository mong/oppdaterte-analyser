import { Types } from "mongoose";

export type Lang = "no" | "en";
export interface Text {
  no: string;
  en: string;
}

export interface View {
  name: string;
  type: string;
  aggregering: string;
  year_range: [number, number];
  title: Text;
  variables: (Text & { name: string })[];
}

export interface Analyse {
  _id: Types.ObjectId;
  name: string;
  version: number;
  published: boolean;
  tags: string[];
  age_range: [number, number];
  kjonn: "begge" | "menn" | "kvinner";
  kontakt_begrep: Text;
  kategori_begrep: Text;
  title: Text;
  description: Text;
  summary: Text;
  discussion: Text;
  info: Text;
  createdAt: Date;
  updatedAt: Date;
  generated: number;
  views: View[];
  data: {
    [key: string]: {
      [key: string]: {
        [key: string]: {
          [key: string]: {
            [key: string]: {
              [key: string]: number;
            };
          };
        };
      };
    };
  };
}

export interface Tag {
  _id: Types.ObjectId;
  name: string;
  fullname: Text;
  introduction: Text;
}
