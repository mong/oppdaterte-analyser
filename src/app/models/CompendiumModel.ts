import mongoose, { Schema, Types } from "mongoose";
import { LocalizedString } from "./Types";

export interface Compendium {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  publishedAt: Date;
  isPublished: boolean;
  analysisIds: [Types.ObjectId];
}

const compendiumSchema = new Schema<Compendium>(
  {
    slug: String,
    title: {
      en: String,
      no: String,
    },
    subtitle: {
      en: String,
      no: String,
    },
    description: {
      en: String,
      no: String,
    },
    publishedAt: { type: Date },
    isPublished: { type: Boolean },
    analysisIds: { type: [Types.ObjectId] },
  },
  { collection: "compendiums", timestamps: true },
);

export default mongoose.models.Compendium ||
  mongoose.model<Compendium>("Compendium", compendiumSchema);
