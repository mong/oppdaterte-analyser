import mongoose, { Schema, Types } from "mongoose";

interface View {
  view: string;
  labels?: [{ [key: string]: string }];
}

export interface Analyse {
  _id: Types.ObjectId;
  tags: [string];
  name: string;
  published: number;
  title: { [key: string]: string };
  description: { [key: string]: string };
  views: View[];
  data: {
    [key: string]: {
      [key: string]: {
        [key: string]: number[][];
      };
    };
  };
}

const analyseSchema = new Schema<Analyse>(
  {
    name: String,
    title: {
      type: Map,
      of: String,
    },
    description: {
      type: Map,
      of: String,
    },
    published: { type: Number },
    tags: { type: [String] },
    views: [
      {
        view: String,
        labels: [
          {
            type: Map,
            of: String,
          },
        ],
      },
    ],
    data: {
      type: Map,
      of: {
        type: Map,
        of: {
          type: Map,
          of: [[Number]],
        },
      },
    },
  },
  { collection: "analyser", timestamps: true },
);

export default mongoose.models.Analyse ||
  mongoose.model<Analyse>("Analyse", analyseSchema);
