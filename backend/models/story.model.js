import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    replies: [
      {
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Story=mongoose.model("Story", storySchema);

export default Story;
