import mongoose, { Schema } from "mongoose";
import { Analyse } from "@/types";

const schemaType = {
  name: String,
  title: { type: Map, of: String },
  summary: { type: Map, of: String },
  discussion: { type: Map, of: String },
  info: { type: Map, of: String },
  description: { type: Map, of: String },
  published: { type: Number },
  first_published: { type: Number },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  tags: { type: [String] },
  views: [
    {
      name: String,
      title: {
        type: Map,
        of: String,
      },
      variables: [
        {
          type: Map,
          of: String,
        },
      ],
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
        createdAt: { type: Date, expires: 60 * 60, default: Date.now },
      },
      { timestamps: true, versionKey: false },
    ),
    "analyser_backup",
  );
