import { Request, Response } from "express";
import User from "../lib/models/userModel";

// TypeScript interfaces for request body
interface BookmarkRequest {
  userId: string;
  jobId: string;
}

// Helper function for database connectivity (should be called once during app initialization)
import { connectDB } from "../lib/db";

// add bookmark to user
const addToBookmark = async (req: Request, res: Response) => {
  const { userId, jobId } = req.body as BookmarkRequest;

  if (!userId || !jobId) {
    return res.status(400).json({
      ok: false,
      message: "Please fill in all fields!",
    });
  }

  try {
    // Connect to database
    await connectDB();

    // Check if bookmark already exists
    const doesBookmarkExist = await User.findOne({
      _id: userId,
      bookmarks: { $elemMatch: { jobId } },
    });

    // If bookmark exists, return error
    if (doesBookmarkExist) {
      return res.status(400).json({
        ok: false,
        message: "Job already bookmarked",
      });
    }

    // Add to bookmark to user using $push
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { bookmarks: { jobId, createdAt: new Date() } } },
      { new: true }
    );

    // If user not found or update failed, return error
    if (!updatedUser) {
      return res.status(400).json({
        ok: false,
        message: "User not found or update failed",
      });
    }

    // Return success message if bookmark added successfully
    return res.status(200).json({
      ok: true,
      message: "Job bookmarked successfully!",
    });
  } catch (err) {
    console.error(err); // Log error (consider different logging based on environment)
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : null,
    });
  }
};

const removeFromBookmark = async (req: Request, res: Response) => {
  const { userId, jobId } = req.body as BookmarkRequest;

  try {
    // Connect to database
    await connectDB();

    // Check if bookmark exists
    const doesBookmarkExist = await User.findOne({
      _id: userId,
      bookmarks: { $elemMatch: { jobId } },
    });

    // If bookmark does not exist, return error
    if (!doesBookmarkExist) {
      return res.status(400).json({
        ok: false,
        message: "Job not bookmarked",
      });
    }

    // Remove from bookmarks using $pull
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: { jobId } } },
      { new: true }
    );

    // If user not found or update failed, return error
    if (!updatedUser) {
      return res.status(400).json({
        ok: false,
        message: "User not found or update failed",
      });
    }

    // Return success message if bookmark removed successfully
    return res.status(200).json({
      ok: true,
      message: "Job removed from bookmark!",
    });
  } catch (err) {
    console.error(err); // Log error
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : null,
    });
  }
};

const getBookmarks = async (req: Request, res: Response) => {
  const { userId } = req.body as BookmarkRequest;

  try {
    // Connect to database
    await connectDB();

    // Get user's bookmarks
    const user = await User.findById(userId);

    // If user not found, return error
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "User not found",
      });
    }

    // Return success message if bookmarks fetched successfully
    return res.status(200).json({
      ok: true,
      message: "Bookmarks fetched successfully!",
      bookmarks: user.bookmarks,
    });
  } catch (err) {
    console.error(err); // Log error
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : null,
    });
  }
};

export { addToBookmark, removeFromBookmark, getBookmarks };
