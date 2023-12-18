import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../lib/models/userModel";

const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

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
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Something went wrong!",
      error: err instanceof Error ? err.message : null,
    });
  }
};

const createUser = async (req: Request, res: Response) => {
  const { displayName, email, password } = req.body;

  if (!process.env.SALT_ROUNDS) {
    return res.status(500).json({
      ok: false,
      message: "Something went wrong!",
      error: "SALT_ROUNDS is not defined!",
    });
  }

  if (displayName === "" || email === "" || password === "") {
    return res.status(400).json({
      ok: false,
      message: "Please fill in all fields!",
    });
  }

  try {
    bcrypt.hash(password, process.env.SALT_ROUNDS, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Failed to hash password!",
          error: err instanceof Error ? err.message : null,
        });
      }

      const newUser = await User.create({
        displayName,
        email,
        password: hash,
      });

      if (newUser) {
        return res.status(201).json({
          ok: true,
          message: "User created successfully!",
          user: {
            displayName: newUser.displayName,
            email: newUser.email,
            avatar: newUser.avatar,
          },
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Something went wrong!",
      error: err instanceof Error ? err.message : null,
    });
  }
};

const deleteUser = async () => {};

const getUserByID = async () => {};

export { signInUser, createUser, deleteUser, getUserByID };
