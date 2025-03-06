import mongoose from "mongoose";
import { AnalyseModel } from "@/models/AnalyseModel";
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

const safe_compare = (a: string, b: string) => {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    // Avoiding timing attacks.
  } catch {
    return false; // a and b are of different lengths
  }
};

const verifyApiKey = async () => {
  const apiKey = String((await headers()).get("Authorization"));
  for (let user of await ApiUserModel.find({}).exec()) {
    if (safe_compare(user.apiKey, apiKey)) {
      return user;
    }
  }
  return false;
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

export const getAnalyser = async (sort = "name"): Promise<Analyse[]> => {
  await dbConnect();
  return toPlainObject(
    await AnalyseModel.find({ published: true, version: { $gt: 0 } })
      .sort(sort)
      .exec(),
  );
};

export const getUnpublishedAnalyser = async (
  sort = "name",
): Promise<Analyse[]> => {
  await dbConnect();
  return toPlainObject(
    await AnalyseModel.find({
      published: false,
      version: 0,
      name: {
        $nin: (await getAnalyser()).map((analyse) => analyse.name),
      },
    })
      .sort(sort)
      .exec(),
  );
};

export const getAnalyserByTag = async (
  tag: string,
  sort = "name",
): Promise<Analyse[]> => {
  await dbConnect();
  return toPlainObject(
    await AnalyseModel.find({
      tags: tag,
      published: true,
      version: { $gt: 0 },
    })
      .sort(sort)
      .exec(),
  );
};

export const getTag = async (tag: string): Promise<Tag> => {
  await dbConnect();
  return toPlainObject(await TagModel.findOne({ name: tag }).exec());
};

export const getKompendier = async (sort = "name"): Promise<Tag[]> => {
  await dbConnect();
  return toPlainObject(
    await TagModel.find({ introduction: { $exists: true } })
      .sort(sort)
      .exec(),
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

export const publishAnalyse = async (
  analyseName: string,
): Promise<Response> => {
  await dbConnect();

  const apiUser = await verifyApiKey();
  if (!apiUser) {
    return Response.json({ reply: "Incorrect API-key." }, { status: 401 });
  }

  const newAnalyse = await AnalyseModel.findOne({
    name: analyseName,
    version: 0,
  })
    .select("-_id")
    .exec();

  if (!newAnalyse) {
    return Response.json(
      {
        reply: `'${analyseName}' not found. A test version must be uploaded before it is published. Request denied!`,
      },
      { status: 409 },
    );
  }

  const oldAnalyse = await AnalyseModel.findOne({
    name: analyseName,
    published: true,
    version: { $gt: 0 },
  })
    .sort("-version")
    .exec();

  if (oldAnalyse && oldAnalyse.generated > newAnalyse.generated) {
    return Response.json(
      {
        reply: `The test version of '${newAnalyse.name}' is older than the published version. Request denied!`,
      },
      { status: 409 },
    );
  }

  const maxVersion = await AnalyseModel.findOne({
    name: analyseName,
    version: { $gt: 0 },
  })
    .sort("-version")
    .exec();
  const version = maxVersion ? maxVersion.version + 1 : 1;

  await AnalyseModel.create({
    ...newAnalyse.toObject(),
    version: version,
    published: true,
  });

  await AnalyseModel.updateMany(
    { name: analyseName, published: true, version: { $gt: 0, $ne: version } },
    { published: false },
  );

  return Response.json(
    {
      reply: oldAnalyse
        ? `'${analyseName}' successfully published. Current version: ${version}. Older versions are unpublished, but not deleted.`
        : `'${analyseName}' was successfully published.`,
    },
    { status: 201 },
  );
};
