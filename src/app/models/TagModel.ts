import mongoose, { Schema, Types } from "mongoose";

export interface Tag {
  _id: Types.ObjectId;
  fullname: { [key: string]: string };
  introduction: { [key: string]: string };
}

const tagSchema = new Schema<Tag>(
  {
    fullname: {
      type: Map,
      of: String,
    },
    introduction: {
      type: Map,
      of: String,
    },
  },
  { collection: "tags", timestamps: true },
);

export default mongoose.models.Tag || mongoose.model<Tag>("Tag", tagSchema);
