// controllers/notification.controllers.js
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    receiver: req.userId,
  })
    .populate("sender", "firstname lastname profileImage")
    .populate("post", "description media")
    .sort({ createdAt: -1 });

  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });
  res.json({ message: "Notification read" });
};

