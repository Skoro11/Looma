import express from "express";
import { TokenVerification } from "../utils/JWToken.js";
import {
  createChat,
  getChatByUserId,
  getAllChats,
  removeChat,
  SendMessage,
} from "../controllers/chatController.js";
import User from "../models/User.js";
const router = express.Router();

/* 
POST /chats 
Creates chat with one person 
requires "friendId"*/
router.post("", TokenVerification, createChat);

/* 
GET /chats/user
Finds all chats from te person with this ID */
router.get("/user", TokenVerification, getChatByUserId);

/* 
GET /chats/all
Gets all existing chats independent of user */
router.get("/all", getAllChats);

/* DELETE /chats/delete/{:id}
Deletes chat based on id */
router.delete("/delete/{:id}", removeChat);

/* POST /chats/message
sends message to another User
requires "chatId" and "content" */
router.post("/message", TokenVerification, SendMessage);

export default router;
