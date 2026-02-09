import express from "express";
import {
  accessConversation,
  createGroupConversation,
  deleteConversation,
  getMyConversations,
} from "../controllers/conversation.controllers.js";
import {
  sendMessage,
  getMessages,
} from "../controllers/message.controllers.js"
import isAuth from "../middlewares/isAuth.js";
import upload from '../middlewares/multer.js'

const Messagerouter = express.Router();

Messagerouter.post("/access", isAuth, accessConversation);
Messagerouter.post("/group", isAuth, createGroupConversation);
Messagerouter.get("/", isAuth, getMyConversations);
Messagerouter.post("/message", isAuth, upload.array("media", 10), sendMessage);
Messagerouter.get("/message/:conversationId",isAuth, getMessages);
Messagerouter.delete("/:id", isAuth, deleteConversation);
export default Messagerouter;
