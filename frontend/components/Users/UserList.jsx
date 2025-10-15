import axios from "axios";

export function UserList({ otherUsers, StartChat, setFriends }) {
  const url = "http://localhost:3000";
  async function AddFriendAxios(userId) {
    const response = await axios.post(
      url + "/user/friends/add",
      {
        friendId: userId,
      },
      {
        withCredentials: true,
      }
    );
    if (response.status === 201) {
      const newFriend = response.data.newFriend;
      setFriends((prev) => [...prev, newFriend]);
      console.log("Everything good", response.data.newFriend);
    }
    console.log("Response Add friend", response.data);
  }

  return (
    <ul>
      {otherUsers.map((item, index) => (
        <li
          className="max-w-full flex items-center justify-between p-2 border-b"
          key={index}
        >
          <div className="flex items-center">
            <img className="h-7 mr-2" src="user.png" />
            {item.username}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="bg-blue-100 p-2"
              onClick={() => StartChat(item._id)}
            >
              Chat
            </button>
            <button
              onClick={() => AddFriendAxios(item._id)}
              className="bg-green-100 p-2"
            >
              Add friend
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
