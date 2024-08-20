import mongoose, { Schema, Types } from "mongoose";

export interface ICompendium {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  title: { [key: string]: string };
  subtitle: { [key: string]: string };
  description: { [key: string]: string };
  publishedAt: Date;
  isPublished: boolean;
  analysisIds: [Types.ObjectId];
}

const compendiumSchema = new Schema<ICompendium>(
  {
    slug: { type: String },
    title: {
      type: Map,
      of: String,
    },
    subtitle: {
      type: Map,
      of: String,
    },
    description: {
      type: Map,
      of: String,
    },
    publishedAt: { type: Date },
    isPublished: { type: Boolean },
    analysisIds: { type: [Types.ObjectId] },
  },
  { collection: "compendiums", timestamps: true },
);

export default mongoose.models.Compendium ||
  mongoose.model<ICompendium>("Compendium", compendiumSchema);
