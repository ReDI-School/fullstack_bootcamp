import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    body: {
      type: String,
      required: true,
      maxlength: [1000, "Body cannot be more than 1000 characters"],
    },
    tags: {
      type: [String],
      default: [],
    },
    reactions: {
      likes: {
        type: Number,
        default: 0,
      },
      dislikes: {
        type: Number,
        default: 0,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Define the model this way because of hot reloading in development
export const Tweet =
  mongoose.models.Tweet ?? mongoose.model("Tweet", TweetSchema);
