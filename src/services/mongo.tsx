import mongoose from "mongoose";
import { AnalyseModel, AnalyseBackupModel } from "@/models/AnalyseModel";
import ApiUserModel from "@/models/ApiUserModel";
import { Analyse } from "@/types";
import TagModel from "@/models/TagModel";
import { Tag } from "@/types";
import { headers } from "next/headers";

import crypto from "crypto";

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

const verifyApiKey = async () => {
  const apiKeyHash = crypto
    .createHash("md5")
    .update(String(headers().get("Authorization")))
    .digest("hex");
  return await ApiUserModel.findOne({ apiKeyHash: apiKeyHash }).exec();
};

export const updateAnalyse = async (analyse: Analyse): Promise<Response> => {
  await dbConnect();

  const apiUser = await verifyApiKey();
  if (!apiUser) {
    return Response.json({ reply: "Incorrect API-key." }, { status: 401 });
  }

  const newerAnalyse = await AnalyseModel.findOne({
    name: analyse.name,
    published: { $gte: analyse.published },
  }).exec();
  if (newerAnalyse) {
    return Response.json(
      {
        reply: `'${analyse.name}' is not newer than the version on the server. Request denied!`,
      },
      { status: 409 },
    );
  }

  const oldAnalyse = await AnalyseModel.findOne({ name: analyse.name }).exec();
  const version = oldAnalyse ? oldAnalyse.version + 1 : 1;

  await AnalyseModel.findOneAndUpdate(
    { name: analyse.name },
    {
      ...analyse,
      first_published:
        oldAnalyse?.first_published ||
        oldAnalyse?.published ||
        analyse.published,
      version: version,
    },
    { upsert: true },
  ).exec();

  if (oldAnalyse) {
    let { _id, createdAt, updatedAt, ...strippedAnalyse } =
      oldAnalyse.toObject();
    await new AnalyseBackupModel(strippedAnalyse).save();
  }

  return Response.json(
    {
      reply: oldAnalyse
        ? `'${analyse.name}' successfully updated. Current version: ${version}. A temporary backup was made of the old version (${oldAnalyse.version}).`
        : `'${analyse.name}' was not found on the server, and was created successfully.`,
    },
    { status: 201 },
  );
};
