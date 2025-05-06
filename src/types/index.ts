import { Types } from "mongoose";

export type Lang = "no" | "en";
export interface Text {
  no: string;
  en: string;
}

export interface View {
  name: string;
  title: Text;
  variables: Text[];
}

export interface Analyse {
  _id: Types.ObjectId;
  name: string;
  version: number;
  published: boolean;
  tags: string[];
  age_range: [number, number];
  kjonn: "begge" | "menn" | "kvinner";
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
          [key: string]: number[];
        };
      };
    };
  };
  demografi: {
    [key: string]: {
      [key: string]: {
        [key: string]: {
          [key: string]: number[];
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

export interface ApiUser {
  _id: Types.ObjectId;
  apiKey: string;
  apiKeyHash: string;
  userName: string;
}
