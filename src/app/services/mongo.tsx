import mongoose from "mongoose";

export async function dbConnect(): Promise<any> {
  try {
    const conn = await mongoose.connect(String(process.env.MONGO_URI));
    console.log(`Database connected : ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(err);
  }
}
