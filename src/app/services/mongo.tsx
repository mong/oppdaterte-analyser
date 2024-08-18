import mongoose from "mongoose";
import CompendiumModel from "@/app/models/CompendiumModel";
import AnalysisBoxModel from "../models/AnalysisBoxModel";

export const dbConnect = async (): Promise<any> => {
  try {
    const conn = await mongoose.connect(String(process.env.MONGO_URI));
    console.log(`Database connected : ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(err);
  }
};

export const getCompendiumBySlugAndLang = async (
  compendiumSlug: string,
  lang: string,
) => {
  await dbConnect();
  return await CompendiumModel.findOne({
    slug: compendiumSlug,
    lang: lang,
  }).exec();
};

export const getAnalysisBoxById = async (id: mongoose.Types.ObjectId) => {
  await dbConnect();
  return await AnalysisBoxModel.findById(id).exec();
};
