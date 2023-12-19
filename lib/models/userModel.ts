import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: null },
  password: { type: String, required: true },
  bookmarks: [
    {
      id: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
