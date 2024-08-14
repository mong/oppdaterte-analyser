import mongoose, { Schema, Model } from "mongoose";

export interface Compendium {
  _id: mongoose.Types.ObjectId;
  lang: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
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
    lang: { type: String },
    slug: { type: String },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    boxIds: { type: [Number] },
  },
  { collection: "compendiums" },
);

export default mongoose.models.compendiums ||
  mongoose.model("compendiums", compendiumSchema);
