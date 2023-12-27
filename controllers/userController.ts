import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { connectDB } from "../lib/db";
import User from "../lib/models/userModel";

interface SignInRequest {
  email: string;
  password: string;
}

interface CreateUserRequest {}

interface DeleteUserRequest {}

interface GetUserByIDRequest {
  userId: string;
}

const signInUser = async (req: Request, res: Response) => {
  // Destructure email and password from request body
  const { email, password } = req.body as SignInRequest;

  // If email or password is empty, return error
  if (email === "" || password === "") {
    return res.status(400).json({
      ok: false,
      message: "Please fill in all fields!",
    });
  }

  try {
    // Connect to database
    await connectDB();

    // Check if user exists
    const user = await User.findOne({
      email: email,
    });

    // If user not found, return error
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "User does not exist!",
      });
    }

    // Compare password with hashed password
    const doesItMatch = bcrypt.compareSync(password, user.password);

    // If password does not match, return error
    if (!doesItMatch) {
      return res.status(400).json({
        ok: false,
        message: "Password is incorrect!",
      });
    }

    // Return success message if user logged in successfully
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
    console.error(err);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : null,
    });
  }
};

const createUser = async (req: Request, res: Response) => {
  // Destructure displayName, email and password from request body
  const { displayName, email, password } = req.body;

  // If SALT_ROUNDS is not defined, return error
  if (!process.env.SALT_ROUNDS) {
    console.log("=> Couldn't find SALT_ROUNDS");
    return;
  }

  // If displayName, email or password is empty, return error
  if (displayName === "" || email === "" || password === "") {
    return res.status(400).json({
      ok: false,
      message: "Please fill in all fields!",
    });
  }

  try {
    // Connect to database
    await connectDB();

    // check if user exists
    const doesUserExist = await User.findOne({
      email,
    });

    if (doesUserExist) {
      return res.status(400).json({
        ok: false,
        message: "User already exists!",
      });
    }

    // if user does not exist, hash password
    bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS),
      async (err, hash) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Failed to hash password!",
            error: err instanceof Error ? err.message : null,
          });
        }

        // Create new user
        const newUser = await User.create({
          displayName,
          email,
          password: hash,
        });

        // if user is created successfully, return success message
        if (newUser) {
          return res.status(201).json({
            ok: true,
            message: "User created successfully!",
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : null,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {};

const getUserByID = async (req: Request, res: Response) => {
  // Destructure userId from request body
  const { userId } = req.body as GetUserByIDRequest;

  // If userId is empty, return error
  if (!userId) {
    return res.status(400).json({
      ok: false,
      message: "User ID is required",
    });
  }

  try {
    // Connect to database
    await connectDB();

    // Find user by ID
    const user = await User.findById(userId);

    // If user not found, return error
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User does not exist!",
      });
    }

    // Return success message if user found
    return res.status(200).json({
      ok: true,
      message: "User found",
      user: {
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : null,
    });
  }
};

export { signInUser, createUser, deleteUser, getUserByID };
