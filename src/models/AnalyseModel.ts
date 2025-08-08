import mongoose, { Schema } from "mongoose";
import { Analyse } from "@/types";

const schemaType = {
  name: String,
  version: Number,
  published: Boolean,
  tags: [String],
  age_range: [Number],
  kjonn: { type: String, enum: ["begge", "menn", "kvinner"] },
  title: { no: String, en: String },
  description: { no: String, en: String },
  summary: { no: String, en: String },
  discussion: { no: String, en: String },
  info: { no: String, en: String },
  createdAt: Date,
  updatedAt: Date,
  generated: Number,
  views: [
    {
      name: String,
      type: { type: String },
      aggregering: String,
      year_range: [Number],
      title: { no: String, en: String },
      variables: [{ no: String, en: String, name: String }],
      _id: false,
    },
  ],
  data: {
    type: Map,
    of: {
      type: Map,
      of: {
        type: Map,
        of: {
          type: Map,
          of: {
            type: Map,
            of: {
              type: Map,
              of: Number,
            },
          },
        },
      },
    },
  },
};

const analyseSchema = new Schema<Analyse>(schemaType, {
  timestamps: true,
  versionKey: false,
});

analyseSchema.index(
  { name: 1, version: -1 },
  { partialFilterExpression: { published: true, version: { $gt: 0 } } },
);

export const AnalyseModel =
  mongoose.models.Analyse ||
  mongoose.model<Analyse>("Analyse", analyseSchema, "analyser");
