import express from "express";
import { DbConnection } from "./config/DbConnection.js";
import dotenv from "dotenv";
import { RegisterUser, LoginUser, GetAllUsers } from "./controllers/user.js";
import { TokenVerification } from "./utils/JWToken.js";
import cookieParser from "cookie-parser";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).send("This is the backend");
});

app.post("/api/auth/register", RegisterUser);
app.post("/api/auth/login", LoginUser);
app.get("/api/users", TokenVerification, GetAllUsers);
app.post("/chats", TokenVerification, async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;
  /* console.log(req.user); */
  /* console.log(userId);
  console.log(friendId); */
  if (!friendId) return res.status(400).json({ error: "Friend ID required" });

  let chat = await Chat.findOne({
    participants: { $all: [userId, friendId], $size: 2 },
  });

  if (!chat) {
    chat = await Chat.create({ participants: [userId, friendId] });
  }

  res.json({ chat });
});
app.post("/message", TokenVerification, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.participants.includes(senderId)) {
      return res
        .status(403)
        .json({ error: "You cannot send a message to this chat" });
    }

    const receiverId = chat.participants.find(
      (id) => id.toString() !== senderId
    );

    const message = await Message.create({
      chatId,
      senderId,
      receiverId,
      content,
    });

    chat.lastMessage = message._id;
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/all/messages", TokenVerification, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "username")
      .sort({ createdAt: 1 }); // oldest first

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(3000, () => {
  async function StartServer() {
    const connection = await DbConnection(process.env.MONGODB_URI);
    if (connection === true) {
      console.log("App is listening on port 3000");
    }
  }
  StartServer();
});
