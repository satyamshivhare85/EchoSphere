import Message from "../models/message.models.js";
import Conversation from "../models/conversation.models.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import path from "path";
import { getReceiverSocketId, io} from "../socket/socket.js"; // <-- import

// export const sendMessage = async (req, res) => {
//   try {
//     const me = req.userId;
//     const { conversationId, content, messageType = "text" } = req.body;

//     if (!conversationId) return res.status(400).json({ msg: "conversationId required" });

//     let finalContent = content;

//     // image upload
//     if ((messageType === "image" || messageType === "file") && req.files?.length > 0) {
//       const filePath = path.resolve(req.files[0].path);
//       const uploadResult = await uploadOnCloudinary(filePath);

//       if (!uploadResult) return res.status(500).json({ msg: "Cloudinary upload failed" });

//       finalContent = uploadResult; // UploadOnCloudinary already returns secure_url
//     }

//     if (!finalContent) return res.status(400).json({ msg: "Message cannot be empty" });

//     let msg = await Message.create({
//       conversation: conversationId,
//       sender: me,
//       content: finalContent,
//       messageType,
//       readBy: [me],
//     });

//     msg = await msg.populate("sender", "firstname lastname username profileImage");

//     await Conversation.findByIdAndUpdate(conversationId, { lastMessage: msg._id });

//     res.status(201).json(msg);
//   } catch (err) {
//     console.error("SEND MESSAGE ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };




export const sendMessage = async (req, res) => {
  try {
    const me = req.userId;
    const { conversationId, content, messageType = "text" } = req.body;

    if (!conversationId) return res.status(400).json({ msg: "conversationId required" });

    let finalContent = content;

    // handle image/file upload
    if ((messageType === "image" || messageType === "file") && req.files?.length > 0) {
      const filePath = path.resolve(req.files[0].path);
      const uploadResult = await uploadOnCloudinary(filePath);
      if (!uploadResult) return res.status(500).json({ msg: "Cloudinary upload failed" });
      finalContent = uploadResult; 
    }

    if (!finalContent) return res.status(400).json({ msg: "Message cannot be empty" });

    // Save to DB
    let msg = await Message.create({
      conversation: conversationId,
      sender: me,
      content: finalContent,
      messageType,
      readBy: [me],
    });

    msg = await msg.populate("sender", "firstname lastname username profileImage");

    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: msg._id });

    // ======= SOCKET.IO EMIT =======
    const convo = await Conversation.findById(conversationId);
    const receivers = convo.participants.filter(p => p.toString() !== me.toString());

    receivers.forEach(receiverId => {
      const socketId = getReceiverSocketId(receiverId);
      if (socketId) {
        io.to(socketId).emit("receiveMessage", msg); // send to specific user
      }
    });

    res.status(201).json(msg);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};



export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ msg: "conversationId required" });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "firstname lastname username")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
