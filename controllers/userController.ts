import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../lib/models/userModel";

const signInUser = async (req: Request, res: Response) => {
  const { email, password } = await req.body;

  try {
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "User does not exist!",
      });
    }

    const doesItMatch = bcrypt.compareSync(password, user.password);

    if (!doesItMatch) {
      return res.status(400).json({
        ok: false,
        message: "Password is incorrect!",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "User logged in successfully!",
      user: {
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {}
};

const createUser = async (req: Request, res: Response) => {
  const { displayName, email, password } = await req.body;

  if (!process.env.SALT_ROUNDS) {
    return res.status(404).json({
      ok: false,
      message: "Failed to read .env",
    });
  }

  if (displayName === "" || email === "" || password === "") {
    return res.status(404).json({
      ok: false,
      message: "Please fill out all required fields!",
    });
  }

  return res.status(200).json({
    message: "Account created successfully!",
  });

  // const hashedPassword = bcrypt.hash(
  //   password,
  //   process.env.SALT_ROUNDS,
  //   (err, hash) => {
  //     if (err) return;

  //     return hash;
  //   }
  // );

  // console.log(hashedPassword)

  // try {
  //   const user = await User.create({
  //     displayName,
  //     email,
  //     password: hashedPassword,
  //   });
  // } catch (err) {}
};

const deleteUser = async () => {};

const getUserByID = async () => {};

export { signInUser, createUser, deleteUser, getUserByID };
