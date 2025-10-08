import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
export async function createChat(req, res) {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    let chatId = "";

    if (!friendId) return res.status(400).json({ error: "Friend ID required" });

    let chat = await Chat.findOne({
      participants: { $all: [userId, friendId], $size: 2 },
    });

    /* console.log(chat); */
    if (!chat) {
      chat = await Chat.create({ participants: [userId, friendId] });

      chatId = chat._id;

      /* console.log("Chat Id is " + chatId); */
      const messages = await Message.find({ chatId })
        .populate("senderId", "username")
        .sort({ createdAt: 1 }); // oldest first
      return res
        .status(201)
        .json({ success: true, chat: chat._id, messages: messages });
    }
    if (chat) {
      chatId = chat._id;
      /* console.log("Chat Id is " + chatId); */
      const messages = await Message.find({ chatId })
        .populate("senderId", "username")
        .sort({ createdAt: 1 }); // oldest first

      return res
        .status(200)
        .json({ success: true, chat: chat._id, messages: messages });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
}

export async function getChatByUserId(req, res) {
  try {
    const userId = req.user.id;
    /*  const userId = "68de7286134823dacb72960e"; */
    /* console.log("User id", userId); */
    const userChats = await Chat.find({ participants: userId }).populate(
      "participants",
      "username _id"
    );
    res.status(200).json({ userChats });
  } catch (error) {
    console.log("Error with user chats ", error.message);
  }
}

export async function getAllChats(req, res) {
  const allChats = await Chat.find({});

  res.status(200).json({ allChats });
}
export async function removeChat(req, res) {
  try {
    const { id } = req.params;
    /* console.log("Remove Chat Id", id); */
    const removeChat = await Chat.findByIdAndDelete(id);

    if (!removeChat) {
      return res.status(404).json({ message: "Chat is not found" });
    }

    res.status(200).json({ success: true, removedChat: removeChat });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
}
