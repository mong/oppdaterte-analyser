import mongoose, { Schema, Model } from "mongoose";

export interface Compendium {
  _id: mongoose.Types.ObjectId;
  slug: string;
  boxIds: [
    {
      boxId: number;
    },
  ];
}

type CompendiumModel = Model<Compendium>;

const compendiumSchema = new Schema<Compendium, CompendiumModel>(
  {
    _id: { type: Schema.Types.ObjectId },
    slug: { type: String },
    boxIds: { type: [Number] },
  },
  { collection: "compendiums" },
);

export default mongoose.models.compendiums ||
  mongoose.model("compendiums", compendiumSchema);
