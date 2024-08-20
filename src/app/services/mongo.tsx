import mongoose from "mongoose";
import CompendiumModel from "@/app/models/CompendiumModel";
import AnalysisModel from "@/app/models/AnalysisModel";

export const dbConnect = async (): Promise<any> => {
  try {
    return await mongoose.connect(String(process.env.MONGO_URI));
  } catch (err) {
    console.error(err);
  }
};

export const getCompendiumBySlug = async (compendiumSlug: string) => {
  await dbConnect();
  return await CompendiumModel.findOne({
    slug: compendiumSlug,
  }).exec();
};

export const getAnalysisById = async (id: mongoose.Types.ObjectId) => {
  await dbConnect();
  return await AnalysisModel.findById(id).exec();
};
