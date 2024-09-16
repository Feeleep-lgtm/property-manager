import { Router } from "express";
//import { createUser } from "../Modules/Chat/chat.userController.js";
import {
  sendMessageController,
  getMessagesController,
  getAllChatsController,
} from "../Modules/Chat/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const messageRoutes = Router();
//messageRoutes.post("/users", authenticateToken, createUser);

// Message routes
messageRoutes.post("/send", authMiddleware, sendMessageController);
messageRoutes.get("/chats/:chatId/", authMiddleware, getMessagesController);
messageRoutes.get("/chats", authMiddleware, getAllChatsController);
export default messageRoutes;
