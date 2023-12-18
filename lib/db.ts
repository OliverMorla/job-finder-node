import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  let isConnected = false;

  if (!process.env.MONGO_URI) {
    return console.log("=> Couldn't find MONGO_URI");
  }

  try {
    mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("=> Connected to DB");
  } catch (err) {
    console.log(err instanceof Error && `=> ${err.message}`);
    isConnected = false;
  }
};

export { connectDB };
