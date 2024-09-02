import mongoose, { Schema } from "mongoose";
import { Tag } from "@/types";

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
