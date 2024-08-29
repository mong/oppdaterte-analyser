import mongoose from "mongoose";
import AnalyseModel from "@/app/models/AnalyseModel";
import TagModel from "@/app/models/TagModel";

export const dbConnect = async (): Promise<any> => {
  try {
    return await mongoose.connect(String(process.env.MONGO_URI));
  } catch (err) {
    console.error(err);
  }
};

export const getAnalyseByName = async (name: string) => {
  await dbConnect();
  return await AnalyseModel.findOne({ name: name }).exec();
};

export const getAnalyserByTag = async (tag: string) => {
  await dbConnect();
  return await AnalyseModel.find({ tags: tag }).exec();
};

export const getTag = async (tag: string) => {
  await dbConnect();
  return await TagModel.findOne({ name: tag }).exec();
};
