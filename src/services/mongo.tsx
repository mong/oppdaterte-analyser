import mongoose from "mongoose";
import { AnalyseModel } from "@/models/AnalyseModel";
import { Analyse } from "@/types";

const TEST_DATABASE = false;

export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const dbConnect = async (): Promise<any> => {
  try {
    return await mongoose.connect(
      String(
        TEST_DATABASE ? process.env.MONGO_URI_TEST : process.env.MONGO_URI_NEW,
      ),
    );
  } catch (err) {
    console.error(err);
  }
};

export const getAnalyse = async (
  analyseName: string,
  version: "published" | number = "published",
): Promise<Analyse> => {
  await dbConnect();
  const query =
    version === "published"
      ? { published: true, version: { $gt: 0 } }
      : { version: version };
  return toPlainObject(
    await AnalyseModel.findOne({ name: analyseName, ...query }).exec(),
  );
};

export const getAnalyseVersions = async (
  analyseName: string,
): Promise<Analyse[]> => {
  await dbConnect();
  return toPlainObject(
    await AnalyseModel.find({ name: analyseName }).sort("version").exec(),
  );
};

export const getAnalyser = async (
  sort = "name",
  projection: string | undefined = undefined,
): Promise<Analyse[]> => {
  await dbConnect();
  return toPlainObject(
    await AnalyseModel.find(
      { published: true, version: { $gt: 0 } },
      projection,
    )
      .sort(sort)
      .exec(),
  );
};

export const getUnpublishedAnalyser = async (
  sort = "name",
): Promise<Analyse[]> => {
  await dbConnect();

  const unpublishedAnalyses = await AnalyseModel.aggregate([
    {
      $group: {
        _id: "$name",
        version: { $max: "$version" },
        published: { $max: "$published" },
      },
    },
    { $match: { published: false } },
  ]);

  return await Promise.all(
    unpublishedAnalyses.map((analyse) =>
      AnalyseModel.findOne({
        published: false,
        version: analyse.version,
        name: analyse._id,
      }),
    ),
  );
};

export const getAnalyserByTag = async (
  tag: string,
  sort = "name",
  projection: string | undefined = undefined,
): Promise<Analyse[]> => {
  await dbConnect();
  return toPlainObject(
    await AnalyseModel.find(
      {
        tags: tag,
        published: true,
        version: { $gt: 0 },
      },
      projection,
    )
      .sort(sort)
      .exec(),
  );
};

export const uploadAnalyse = async (analyse: Analyse): Promise<void> => {
  await dbConnect();

  await AnalyseModel.replaceOne(
    { name: analyse.name, version: 0 },
    {
      ...analyse,
      version: 0,
      published: false,
    },
    { upsert: true },
  );
};

export const publishAnalyseVersion = async (
  analyseName: string,
  version: number,
): Promise<void> => {
  await dbConnect();

  await AnalyseModel.updateMany(
    { name: analyseName, published: true, version: { $gt: 0 } },
    { published: false },
  );

  if (version > 0) {
    await AnalyseModel.updateOne(
      { name: analyseName, version: { $eq: version } },
      { published: true },
    );
  }
};

export const publishTestAnalyse = async (
  analyseName: string,
): Promise<boolean> => {
  await dbConnect();

  const oldAnalyse = await AnalyseModel.findOne({
    name: analyseName,
    version: 0,
  }).exec();
  if (!oldAnalyse) {
    return false;
  }

  const maxVersion = await AnalyseModel.findOne({
    name: analyseName,
    version: { $gt: 0 },
  })
    .sort("-version")
    .exec();
  const version = maxVersion ? maxVersion.version + 1 : 1;

  await AnalyseModel.updateMany(
    { name: analyseName, published: true, version: { $gt: 0 } },
    { published: false },
  );

  await AnalyseModel.updateOne(
    { name: analyseName, version: 0 },
    { published: true, version: version },
  );

  return true;
};
