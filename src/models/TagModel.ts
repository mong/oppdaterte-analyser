import mongoose, { Schema } from "mongoose";
import { Tag } from "@/types";

const tagSchema = new Schema<Tag>(
  {
    name: String,
    fullname: {
      type: Map,
      of: String,
    },
    introduction: {
      type: Map,
      of: String,
    },
  },
  { collection: "tags", timestamps: false },
);

export default mongoose.models.Tag || mongoose.model<Tag>("Tag", tagSchema);
