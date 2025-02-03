import mongoose, { Schema } from "mongoose";
import { Analyse } from "@/types";

const schemaType = {
  name: String,
  version: Number,
  title: { no: String, en: String },
  summary: { no: String, en: String },
  discussion: { no: String, en: String },
  info: { no: String, en: String },
  description: { no: String, en: String },
  published: { type: Number },
  first_published: { type: Number },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  tags: { type: [String] },
  views: [
    {
      name: String,
      title: { no: String, en: String },
      variables: [{ no: String, en: String }],
      _id: false,
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
};

export const AnalyseModel =
  mongoose.models.Analyse ||
  mongoose.model<Analyse>(
    "Analyse",
    new Schema<Analyse>(schemaType, { timestamps: true, versionKey: false }),
    "analyser",
  );

export const AnalyseBackupModel =
  mongoose.models.AnalyseBackup ||
  mongoose.model<Analyse>(
    "AnalyseBackup",
    new Schema<Analyse>(
      {
        ...schemaType,
        createdAt: { type: Date, expires: 60 * 60 * 24 * 7, default: Date.now },
      },
      { timestamps: true, versionKey: false },
    ),
    "analyser_backup",
  );
