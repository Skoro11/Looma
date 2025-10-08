import express from "express";
import { DbConnection } from "./config/DbConnection.js";
import dotenv from "dotenv";
import { RegisterUser, LoginUser, GetAllUsers } from "./controllers/user.js";
import { TokenVerification } from "./utils/JWToken.js";
import cookieParser from "cookie-parser";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";
import cors from "cors";
import {
  createChat,
  getAllChats,
  getChatByUserId,
  removeChat,
} from "./controllers/chatController.js";
import {
  GetChatMessages,
  SendMessage,
} from "./controllers/message.controller.js";
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 must be exact
    credentials: true, // 👈 allow cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("This is the backend");
});
app.get("/api/auth/me", TokenVerification, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.post("/api/auth/register", RegisterUser);
app.post("/api/auth/login", LoginUser);
app.get("/api/users", TokenVerification, GetAllUsers);
app.post("/chats", TokenVerification, createChat);
app.get("/chats/user", TokenVerification, getChatByUserId);
app.get("/chats/all", getAllChats);
app.delete("/chats/delete/{:id}", removeChat);
app.post("/message", TokenVerification, SendMessage);
app.post("/all/messages", TokenVerification, GetChatMessages);
app.listen(3000, () => {
  async function StartServer() {
    const connection = await DbConnection(process.env.MONGODB_URI);
    if (connection === true) {
      console.log("App is listening on port 3000");
    }
  }
  StartServer();
});
