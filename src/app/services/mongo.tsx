import mongoose from "mongoose";
import CompendiumModel from "@/app/models/CompendiumModel";

export const dbConnect = async (): Promise<any> => {
  try {
    const conn = await mongoose.connect(String(process.env.MONGO_URI));
    console.log(`Database connected : ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(err);
  }
};

export const getCompendium = async (compendiumSlug: string, lang: string) => {
  await dbConnect();
  return await CompendiumModel.findOne({
    slug: compendiumSlug,
    lang: lang,
  }).exec();
};
