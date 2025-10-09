import express from "express";
import { DbConnection } from "./config/DbConnection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import AuthRouter from "./routes/auth-route.js";
import UserRouter from "./routes/user-route.js";
import ChatRouter from "./routes/chat-route.js";
dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log("Socket " + socket.id + " joined room " + chatId);
  });

  socket.on("sendMessage", (msg) => {
    io.to(msg.chatId).emit("newMessage", msg);
    console.log("Message sent ", msg);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Used for registering user and login
app.use("/auth", AuthRouter);

// Used for fetching users from DB
app.use("/user", UserRouter);

// Used for manipulating user chats and sending messages
app.use("/chats", ChatRouter);

app.get("/", (req, res) => {
  res.status(200).send("This is the backend");
});

server.listen(3000, () => {
  async function StartServer() {
    const connection = await DbConnection(process.env.MONGODB_URI);
    if (connection === true) {
      console.log("App is listening on port 3000");
    }
  }
  StartServer();
});
