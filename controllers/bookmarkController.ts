import { Request, Response } from "express";
import { connectDB } from "../lib/db";
import User from "../lib/models/userModel";

const addToBookmark = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    await connectDB();
  } catch (err) {}
};

const removeFromBookmark = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    await connectDB();
  } catch (err) {}
};

export { addToBookmark, removeFromBookmark };
