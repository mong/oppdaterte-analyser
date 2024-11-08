import mongoose from "mongoose";
import { AnalyseModel, AnalyseBackupModel } from "@/models/AnalyseModel";
import { Analyse } from "@/types";
import TagModel from "@/models/TagModel";
import { Tag } from "@/types";

const TEST_DATABASE = false;

export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const dbConnect = async (): Promise<any> => {
  try {
    return await mongoose.connect(
      String(
        TEST_DATABASE ? process.env.MONGO_URI_TEST : process.env.MONGO_URI,
      ),
    );
  } catch (err) {
    console.error(err);
  }
};

export const getAnalyse = async (analyseName: string): Promise<Analyse> => {
  await dbConnect();
  return toPlainObject(
    await AnalyseModel.findOne({ name: analyseName }).exec(),
  );
};

export const updateAnalyse = async (analyse: Analyse): Promise<void> => {
  await dbConnect();
  const oldAnalyse = await AnalyseModel.findOne({ name: analyse.name }).exec();

  await AnalyseModel.findOneAndUpdate(
    { name: analyse.name },
    {
      ...analyse,
      first_published:
        oldAnalyse?.first_published ||
        oldAnalyse?.published ||
        analyse.published,
    },
    { upsert: true },
  ).exec();

  if (oldAnalyse) {
    let { _id, createdAt, updatedAt, ...strippedAnalyse } =
      oldAnalyse.toObject();
    await new AnalyseBackupModel(strippedAnalyse).save();
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

export const getKompendier = async (): Promise<Tag[]> => {
  await dbConnect();
  return toPlainObject(
    await TagModel.find({ introduction: { $exists: true } }).exec(),
  );
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
