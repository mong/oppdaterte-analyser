import mongoose, { Schema } from "mongoose";
import { ApiUser } from "@/types";

const apiUserSchema = new Schema<ApiUser>(
  {
    apiKey: String,
    apiKeyHash: String,
    userName: String,
  },
  { collection: "apiUsers", timestamps: false },
);

export default mongoose.models.ApiUser ||
  mongoose.model<ApiUser>("ApiUser", apiUserSchema);
