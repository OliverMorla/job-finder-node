import { Request, Response } from "express";
import { connectDB } from "../lib/db";
import User from "../lib/models/userModel";

const addToBookmark = async (req: Request, res: Response) => {
  const { userId, jobId } = req.body;

  if (userId === "" || jobId === "") {
    return res.status(400).json({
      ok: false,
      message: "Please fill in all fields!",
    });
  }
  try {
    await connectDB();

    const doesBookmarkExist = await User.findOne({
      _id: userId,
      "bookmarks.id": jobId,
    });

    if (doesBookmarkExist) {
      return res.status(400).json({
        ok: false,
        message: "Job already bookmarked!",
      });
    }

    const bookmark = await User.findOne(
      {
        _id: userId,
      },
      {
        $push: {
          bookmarks: {
            id: jobId,
            createdAt: Date.now(),
          },
        },
      }
    );

    if (!bookmark) {
      return res.status(400).json({
        ok: false,
        message: "Something went wrong!",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Job bookmarked successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Something went wrong!",
      error: err instanceof Error ? err.message : null,
    });
  }
};

const removeFromBookmark = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    await connectDB();
  } catch (err) {}
};

export { addToBookmark, removeFromBookmark };
