import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    tweetId: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 280,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
