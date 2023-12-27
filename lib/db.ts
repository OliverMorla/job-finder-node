import mongoose from "mongoose";
import dotenv from "dotenv";

// dotenv.config will read the .env file and assign the variables to process.env
dotenv.config();

let isConnected = false;

const connectDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  if (!process.env.MONGO_URI) {
    console.log("=> Couldn't find MONGO_URI");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("=> Connected to DB");
  } catch (err) {
    console.error(err instanceof Error && `=> ${err.message}`);
    isConnected = false;
  }
};

export { connectDB };
