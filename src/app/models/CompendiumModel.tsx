import mongoose, { Schema, Types } from "mongoose";

const compendiumSchema = new Schema(
  {
    lang: { type: String, required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    boxes: { type: [Types.ObjectId], required: true },
  },
  { collection: "compendiums", timestamps: true },
);

export default mongoose.models.Compendium ||
  mongoose.model("Compendium", compendiumSchema);
