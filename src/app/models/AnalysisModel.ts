import mongoose, { Schema, Types } from "mongoose";

export interface Analysis {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  title: { [key: string]: string };
  description: { [key: string]: string };
  publishedAt: Date;
  isPublished: boolean;
  tags: [string];
  variables: [string];
  data: {
    [key: string]: {
      [key: string]: {
        [key: string]: number;
      };
    };
  };
}

const analysisSchema = new Schema<Analysis>(
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
    publishedAt: { type: Date },
    isPublished: { type: Boolean },
    tags: { type: [String] },
    variables: { type: [String] },
    data: {
      type: Map,
      of: {
        type: Map,
        of: {
          type: Map,
          of: [Number],
        },
      },
    },
  },
  { collection: "analyses", timestamps: true },
);

export default mongoose.models.Analysis ||
  mongoose.model<Analysis>("Analysis", analysisSchema);
