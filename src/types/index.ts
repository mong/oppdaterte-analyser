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
  tags: string[];
  name: string;
  published: number;
  first_published: number;
  createdAt: Date;
  updatedAt: Date;
  title: Text;
  summary: Text;
  discussion: Text;
  info: Text;
  description: Text;
  views: View[];
  data: {
    [key: string]: {
      [key: string]: {
        [key: string]: number[][];
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
