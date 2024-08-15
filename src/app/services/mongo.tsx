import mongoose from "mongoose";
import compendiums from "@/app/models/compendiumModel";

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
  return await compendiums.findOne({ slug: compendiumSlug, lang: lang }).exec();
};
