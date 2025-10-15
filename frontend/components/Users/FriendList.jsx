import axios from "axios";

export function FriendList({ friends, StartChat, setFriends }) {
  const url = "http://localhost:3000";
  async function RemoveFriendAxios(userId) {
    const response = await axios.delete(
      url + "/user/friends/remove/" + userId,

      {
        withCredentials: true,
      }
    );
    if (response) {
      console.log("Everything good");
      const updatedFriends = friends.filter((friend) => friend._id != userId);
      console.log("Updated friends", updatedFriends);
      setFriends(updatedFriends);
    }

    console.log("Response Remove friend", response.data);
  }

  return (
    <ul>
      {friends.map((item, index) => (
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
              onClick={() => RemoveFriendAxios(item._id)}
              className="bg-red-100 p-2"
            >
              Remove friend
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
