import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./lib/db";

import userRouter from "./routes/userRoutes";
import bookmarkRouter from "./routes/bookmarkRoutes";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use("/auth", userRouter);
app.use("/auth/bookmark",  bookmarkRouter);

const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  await connectDB();
  res
    .json({
      message: "Server is Running!",
    })
    .status(200);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
