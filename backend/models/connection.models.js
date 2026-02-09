// models/connection.model.js
import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"], // ✅ FIX
      default: "pending",
    },
  },
  { timestamps: true }
);

const Connection = mongoose.model("Connection", ConnectionSchema);
export default Connection;


ConnectionSchema.index(
  { sender: 1, receiver: 1 },
  { unique: true }
);
