import mongoose, { Schema } from "mongoose";

const resultBoxSchema = new Schema(
  {
    lang: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { collection: "resultbox", timestamps: true },
);

export default mongoose.models.ResultBox ||
  mongoose.model("ResultBox", resultBoxSchema);
