import mongoose, { Schema } from "mongoose";
import { Analyse } from "@/types";

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
