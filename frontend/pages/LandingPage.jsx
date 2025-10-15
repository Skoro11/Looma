import { useEffect, useState, useRef } from "react";
import { CheckToken } from "../api/auth/CheckToken";
import axios from "axios";
import { toast } from "react-toastify";
import { socket } from "../../backend/utils/SocketIO";
import { UserList } from "../components/Users/UserList";
import { FriendList } from "../components/Users/FriendList";

export function LandingPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showFriends, setShowFriends] = useState(false);
  const [userFriends, setUserFriends] = useState([]);
  const [user, setUser] = useState({ id: "", email: "", username: "" });
  const [otherUsers, setOtherUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [currentChat, setCurrentChat] = useState();
  const messagesEndRef = useRef(null);
  useEffect(() => {
    console.log("userFriends changed:", userFriends);
  }, [userFriends]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.emit("connection", () => {
      console.log("Connected to server with id:", socket.id);
    });
  });
  useEffect(() => {
    socket.emit("joinChat", currentChat);
  }, [currentChat]);

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("newMessage");
  }, []);

  async function StartChat(friend_id) {
    try {
      const response = await axios.post(
        `${API_URL}/chats`,
        {
          friendId: friend_id,
        },
        { withCredentials: true }
      );
      /*  console.log("Friend ID", friend_id); */
      if (response.data.success === true) {
        toast.success("Chat successfully created");
      }
      console.log("Start chat response data", response.data);
      const chatId = response.data.chat;
      setCurrentChat(chatId);
      /*       socket.emit("joinChat", chatId);
       */ const messages = response.data.messages;
      console.log("Response Messages", messages);
      setMessages(messages);
    } catch (error) {
      if (error.status === 409) {
        toast.error("Chat already exists");
      }
      /*  console.log("Error with StartChat", error.status); */
    }
  }

  async function DeleteChat(chat_id) {
    try {
      const response = await axios.delete(`${API_URL}/chats/delete/${chat_id}`);
      console.log("Delete Chat response", response.data);
      if (response.data.success === true) {
        toast.success("Chat deleted successfully");
      }
      setMessages([]);
      setCurrentChat();
    } catch (error) {
      toast.error("Problem with deleting Chat");
      console.log("Eror with deleteing chat", error.message);
    }
  }

  async function sendMessage() {
    try {
      const response = await axios.post(
        `${API_URL}/chats/message`,
        {
          chatId: currentChat,
          content: messageInput,
        },
        { withCredentials: true }
      );
      console.log("Send message response", response.data);
      if (response.status === 200) {
        const newMessage = {
          chatId: currentChat,
          senderId: { _id: user.id, username: user.username },
          content: messageInput,
        };
        socket.emit("sendMessage", newMessage);
      }
      setMessageInput("");
    } catch (error) {
      console.log(error.message);
    }
  }
  async function TokenResponse() {
    const response = await CheckToken();

    const user = response.data.user;
    setUser({ id: user.id, email: user.email, username: user.username });
    /* console.log("User Token ", user); */
  }
  async function getUsers() {
    const response = await axios.get(`${API_URL}/user/others`, {
      withCredentials: true,
    });
    console.log("Response of getUsers ", response.data.users);
    const users = response.data.users;

    setOtherUsers(users);
  }
  async function getUserFriends() {
    /*  Returns an array of id and username */
    const response = await axios.get(`${API_URL}/user/friends/all`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      const userFriends = response.data.userFriends;

      setUserFriends(userFriends);
    }
  }
  useEffect(() => {
    TokenResponse();
    getUsers();
    getUserFriends();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto pt-10">
      <div className="bg-white shadow-xl rounded-2xl p-10 ">
        <h1 className="flex items-center justify-between mb-6 w-full">
          <img
            src="looma.png"
            alt="Looma Logo"
            className="w-10 h-10 object-contain"
          />
          <span>{user.username}</span>
          <a href="/" className="text-gray-500">
            <button className="cursor-pointer bg-red-400 p-2 rounded text-white hover:bg-red-200">
              {" "}
              Logout
            </button>
          </a>
        </h1>
        <div className="flex">
          <div className="border w-2/4 ">
            <button
              onClick={() => setShowFriends(false)}
              className={`pb-1 border-b-2 ${
                !showFriends ? "border-blue-500" : "border-transparent"
              }`}
            >
              Users
            </button>{" "}
            <button
              onClick={() => setShowFriends(true)}
              className={`pb-1 border-b-2 ${
                showFriends ? "border-blue-500" : "border-transparent"
              }`}
            >
              Friends
            </button>
            {showFriends ? (
              <FriendList
                friends={userFriends}
                StartChat={StartChat}
                setFriends={setUserFriends}
              />
            ) : (
              <UserList
                otherUsers={otherUsers}
                StartChat={StartChat}
                setFriends={setUserFriends}
              />
            )}
          </div>

          <div className="border w-3/4 relative min-h-full">
            <h1>
              Chat Messages || UserId -- {user.id}{" "}
              {currentChat ? (
                <button
                  onClick={() => DeleteChat(currentChat)}
                  className="float-right bg-red-100 p-2 "
                >
                  Delete Chat
                </button>
              ) : (
                <button>No chat</button>
              )}{" "}
            </h1>

            <h1>Current Chat {currentChat}</h1>
            <ul>
              <ul className="h-80 overflow-y-auto p-4 space-y-2 border border-gray-300">
                {messages.map((message) => (
                  <li key={message._id}>
                    {message.senderId._id === user.id ? (
                      <div className="text-right">
                        <h1 className="font-bold">
                          {message.senderId.username}
                        </h1>
                        <p>{message.content}</p>
                      </div>
                    ) : (
                      <div className="text-left">
                        <h1 className="font-bold">
                          {message.senderId.username}
                        </h1>
                        <p>{message.content}</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </li>
                ))}
              </ul>
            </ul>
            <div className="absolute bottom-0 left-0 w-full flex flex-col">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                type="text"
                className="border py-2 mb-2"
                placeholder="Message..."
              />
              <button
                onClick={() => sendMessage()}
                className=" bg-green-100 text-center py-4 border-t"
              >
                {" "}
                Send Message
              </button>
            </div>
          </div>
        </div>
        <h1>Friends</h1>
        {userFriends.map((item, index) => {
          return (
            <li key={index} className="">
              {item.username}
            </li>
          );
        })}
      </div>
    </div>
  );
}
