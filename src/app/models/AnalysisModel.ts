import mongoose, { Schema, Types } from "mongoose";
import { LocalizedString, NamedVectorsList } from "./Types";

export interface Analysis {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  title: LocalizedString;
  description: LocalizedString;
  publishedAt: Date;
  isPublished: boolean;
  tags: [string];
  variables: [string];
  data: [NamedVectorsList];
}

const analysisSchema = new Schema<Analysis>(
  {
    name: String,
    title: {
      en: String,
      no: String,
    },
    description: {
      en: String,
      no: String,
    },
    publishedAt: Date,
    isPublished: Boolean,
    tags: [String],
    variables: [String],
    data: {
      name: String,
      list: [
        {
          name: String,
          vectors: [
            {
              name: String,
              vector: [Number],
            },
          ],
        },
      ],
    },
  },
  { collection: "analyses", timestamps: true },
);

export default mongoose.models.Analysis ||
  mongoose.model<Analysis>("Analysis", analysisSchema);
