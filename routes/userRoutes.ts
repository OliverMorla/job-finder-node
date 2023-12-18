import express, { NextFunction, Request, Response } from "express";
import { createUser, signInUser } from "../controllers/userController";

const userRouter = express.Router();

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const account = true;
  if (account) {
    return next();
  }
};

userRouter.get(
  "/dashboard",
  isAuthenticated,
  async (req: Request, res: Response) => {
    res
      .json({
        message: "User dashboard route!",
      })
      .status(200);
  }
);

userRouter.post("/login", signInUser);

userRouter.post("/register", createUser);

export default userRouter;
