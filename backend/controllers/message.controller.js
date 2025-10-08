import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
export async function SendMessage(req, res) {
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
}

export async function GetChatMessages(req, res) {
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
}
