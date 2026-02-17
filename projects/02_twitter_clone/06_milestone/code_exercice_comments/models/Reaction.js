import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      required: true,
      enum: ["tweet", "comment"], // Future-proof for comment reactions
      index: true,
    },
    sourceId: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["like", "dislike"],
    },
  },
  { timestamps: true }
);

// Compound index: one reaction per author per source
reactionSchema.index({ sourceType: 1, sourceId: 1, author: 1 }, { unique: true });

export const Reaction = mongoose.models.Reaction || mongoose.model("Reaction", reactionSchema);
