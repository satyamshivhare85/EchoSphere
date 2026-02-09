import mongoose from "mongoose";
import Connection from "../models/connection.models.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

/* ================= SEND CONNECTION REQUEST ================= */
export const sendRequest = async (req, res) => {
  try {
    const { userId: receiverId } = req.params;
    const senderId = req.userId;

    console.log("senderId:", senderId, "receiverId:", receiverId);

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "You cannot connect with yourself" });
    }

    const senderUser = await User.findById(senderId);
    if (!senderUser) return res.status(404).json({ message: "User not found" });

    // Already connected
    if (senderUser.connections?.includes(receiverId)) {
      return res.status(400).json({ message: "Already connected" });
    }

    // Check existing connection
    let existingConnection = await Connection.findOne({
      $or: [
        { sender: new mongoose.Types.ObjectId(senderId), receiver: new mongoose.Types.ObjectId(receiverId) },
        { sender: new mongoose.Types.ObjectId(receiverId), receiver: new mongoose.Types.ObjectId(senderId) },
      ],
    });

    if (existingConnection) {
      if (existingConnection.status === "pending") {
        return res.status(400).json({ message: "Connection request already exists" });
      }
      if (existingConnection.status === "accepted") {
        return res.status(400).json({ message: "Already connected" });
      }
    } else {
      existingConnection = await Connection.create({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
      });
    }

    // Notification
    await Notification.create({
      receiver: receiverId,
      sender: senderId,
      type: "connection_request",
    });

    // Emit to receiver only
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "newConnectionRequest",
        await existingConnection.populate("sender", "firstname lastname username profileImage")
      );
    }

    return res.status(201).json({
      message: "Connection request sent",
      connection: existingConnection,
    });
  } catch (error) {
    console.error("Send request error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Connection already exists" });
    }
    return res.status(500).json({ message: "Send request error", error: error.message });
  }
};
/* ================= ACCEPT CONNECTION ================= */
export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection not found" });
    if (connection.receiver.toString() !== userId.toString()) return res.status(403).json({ message: "Not authorized" });
    if (connection.status !== "pending") return res.status(400).json({ message: "Already processed" });

    connection.status = "accepted";
    await connection.save();

    await User.findByIdAndUpdate(connection.sender, { $addToSet: { connections: connection.receiver.toString() } });
    await User.findByIdAndUpdate(connection.receiver, { $addToSet: { connections: connection.sender.toString() } });

    await Notification.create({
      receiver: connection.sender,
      sender: connection.receiver,
      type: "connection_accepted",
    });

    const populatedConnection = await connection.populate("sender receiver", "firstname lastname username profileImage headline");

    const senderSocketId = getReceiverSocketId(connection.sender.toString());
    const receiverSocketId = getReceiverSocketId(connection.receiver.toString());
    if (senderSocketId) io.to(senderSocketId).emit("connectionAccepted", populatedConnection);
    if (receiverSocketId) io.to(receiverSocketId).emit("connectionAccepted", populatedConnection);

    return res.status(200).json({ message: "Connection accepted", connection: populatedConnection });
  } catch (error) {
    console.error("Accept connection error:", error);
    return res.status(500).json({ message: "Accept connection error" });
  }
};

/* ================= REJECT CONNECTION ================= */
export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection not found" });
    if (connection.receiver.toString() !== userId.toString()) return res.status(403).json({ message: "Not authorized" });
    if (connection.status !== "pending") return res.status(400).json({ message: "Already processed" });

    connection.status = "rejected";
    await connection.save();

    const senderSocketId = getReceiverSocketId(connection.sender.toString());
    if (senderSocketId) io.to(senderSocketId).emit("connectionRejected", { connectionId });

    return res.status(200).json({ message: "Connection rejected" });
  } catch (error) {
    console.error("Reject connection error:", error);
    return res.status(500).json({ message: "Reject connection error" });
  }
};

/* ================= REMOVE CONNECTION ================= */
export const removeConnection = async (req, res) => {
  try {
    const loggedInUser = req.userId;
    const { userId } = req.params;

    const connection = await Connection.findOne({
      $or: [
        { sender: loggedInUser, receiver: userId },
        { sender: userId, receiver: loggedInUser },
      ],
      status: "accepted",
    });

    if (!connection) return res.status(404).json({ message: "Connection not found" });

    await User.findByIdAndUpdate(loggedInUser, { $pull: { connections: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { connections: loggedInUser } });
    await Connection.findByIdAndDelete(connection._id);

    const loggedInSocketId = getReceiverSocketId(loggedInUser.toString());
    const removedSocketId = getReceiverSocketId(userId.toString());
    if (loggedInSocketId) io.to(loggedInSocketId).emit("connectionRemoved", { userId });
    if (removedSocketId) io.to(removedSocketId).emit("connectionRemoved", { userId: loggedInUser });

    return res.status(200).json({ message: "Connection removed" });
  } catch (error) {
    console.error("Remove connection error:", error);
    return res.status(500).json({ message: "Remove connection error" });
  }
};

/* ================= GET CONNECTION STATUS ================= */
export const getConnectionStatus = async (req, res) => {
  try {
    const loggedInUser = req.userId;
    const { userId } = req.params;

    const connection = await Connection.findOne({
      $or: [
        { sender: loggedInUser, receiver: userId },
        { sender: userId, receiver: loggedInUser },
      ],
    });

    if (!connection) return res.status(200).json({ status: "none" });

    return res.status(200).json({ status: connection.status, sender: connection.sender, receiver: connection.receiver });
  } catch (error) {
    console.error("Get status error:", error);
    return res.status(500).json({ message: "Get status error" });
  }
};

/* ================= GET PENDING REQUESTS ================= */
export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const requests = await Connection.find({ receiver: userId, status: "pending" })
      .populate("sender", "firstname lastname username profileImage headline");

    return res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    console.error("Get requests error:", error);
    return res.status(500).json({ message: "Get requests error" });
  }
};

/* ================= GET USER CONNECTIONS ================= */
export const getUserConnections = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("connections", "firstname lastname username profileImage headline");
    return res.status(200).json({ count: user.connections.length, connections: user.connections });
  } catch (error) {
    console.error("Get connections error:", error);
    return res.status(500).json({ message: "Get connections error" });
  }
};
