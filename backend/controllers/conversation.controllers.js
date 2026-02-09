import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";

export const accessConversation = async (req, res) => {
  try {
    const { userId } = req.body; // other person
    const me = req.userId;

    if (!userId) {
      return res.status(400).json({ msg: "UserId required" });
    }

    // check if already exists
    let convo = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [me, userId] },
    }).populate("participants", "-password")
      .populate("lastMessage");

    if (convo) return res.status(200).json(convo);

    // create new
    convo = await Conversation.create({
      isGroup: false,
      participants: [me, userId],
    });

    convo = await convo.populate("participants", "-password");

    res.status(201).json(convo);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const createGroupConversation = async (req, res) => {
  try {
    const { name, participants } = req.body;
    const me = req.userId;

    if (!name || participants.length < 2) {
      return res.status(400).json({ msg: "Group needs name & users" });
    }

    const group = await Conversation.create({
      name,
      isGroup: true,
      participants: [...participants, me],
      admins: [me],
    });

    const fullGroup = await Conversation.findById(group._id)
      .populate("participants", "-password");

    res.status(201).json(fullGroup);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const getMyConversations = async (req, res) => {
  try {
    const me = req.userId;

    const convos = await Conversation.find({
      participants: me,
    })
      .populate("participants", "-password")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "firstname lastname username" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(convos);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params; // conversationId
    const userId = req.userId;

    const convo = await Conversation.findById(id);
    if (!convo) return res.status(404).json({ msg: "Conversation not found" });

    // Check permissions
    if (convo.isGroup) {
      // only admin can delete group
      if (!convo.admins.includes(userId)) {
        return res.status(403).json({ msg: "Only admins can delete this group" });
      }
    } else {
      // for 1-on-1, only participants can delete
      if (!convo.participants.includes(userId)) {
        return res.status(403).json({ msg: "Not authorized to delete this chat" });
      }
    }

    // Delete all messages in this conversation
    await Message.deleteMany({ conversation: id });

    // Delete the conversation itself
    await Conversation.findByIdAndDelete(id);

    res.status(200).json({ msg: "Conversation deleted successfully" });
  } catch (err) {
    console.error("Delete conversation error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
