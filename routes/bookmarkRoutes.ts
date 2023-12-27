import express, { NextFunction, Request, Response } from "express";
import {
  addToBookmark,
  removeFromBookmark,
} from "../controllers/bookmarkController";

const bookmarkRouter = express.Router();

bookmarkRouter.post("/add", addToBookmark);
bookmarkRouter.delete("/remove", removeFromBookmark);

export default bookmarkRouter;
