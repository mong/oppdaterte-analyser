import mongoose, { Schema } from "mongoose";

const analysisBoxSchema = new Schema(
  {
    lang: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { collection: "analysisBoxes", timestamps: true },
);

export default mongoose.models.AnalysisBox ||
  mongoose.model("AnalysisBox", analysisBoxSchema);
