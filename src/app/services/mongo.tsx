import mongoose from "mongoose";
import AnalyseModel, { Analyse } from "@/app/models/AnalyseModel";
import TagModel, { Tag } from "@/app/models/TagModel";

export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const dbConnect = async (): Promise<any> => {
  try {
    return await mongoose.connect(String(process.env.MONGO_URI));
  } catch (err) {
    console.error(err);
  }
};

export const getAnalyserByTag = async (tag: string): Promise<Analyse[]> => {
  await dbConnect();
  return toPlainObject(await AnalyseModel.find({ tags: tag }).exec());
};

export const getTag = async (tag: string): Promise<Tag> => {
  await dbConnect();
  return toPlainObject(await TagModel.findOne({ name: tag }).exec());
};

export const getTags = async (
  tags: string[],
): Promise<{ [k: string]: Tag }> => {
  await dbConnect();
  const tagData = toPlainObject(
    await TagModel.find({ name: { $in: tags } }).exec(),
  );
  return Object.fromEntries(tagData.map((tag) => [tag.name, tag]));
};
