import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // change this to match your backend

const Chat = ({ user }) => {
  const [recipientId, setRecipientId] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);






  const [allUsers, setAllUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null); // instead of recipientId

const fetchUsers = async () => {
  try {
    const res = await axios.get("http://localhost:5000/auth/getallusers"); // You'll need this backend route
    const otherUsers = res.data.filter((u) => u._id !== user.user._id);
    setAllUsers(otherUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

useEffect(() => {
  fetchUsers();
}, []);

 

const fetchMessages = async () => {
  if (!selectedUser) return;

  try {
    const res = await axios.post("http://localhost:5000/messages/getmsg", {
      senderId: user.user._id,
      recipientId: selectedUser._id,
    });

    setMessages(res.data);
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
};


 const sendMessage = async () => {
  if (!text.trim() || !selectedUser) return;

  const messageData = {
    senderId: user.user._id,
    recipientId: selectedUser._id,
    text,
  };

  await axios.post("http://localhost:5000/messages/sendmsg", messageData);
  socket.emit("sendMessage", messageData);
  setMessages((prev) => [...prev, messageData]);
  setText("");
};


  useEffect(() => {
    fetchMessages();

    socket.on("receiveMessage", (data) => {
      // Only push message if you're the recipient
      if (data.recipientId === user.user._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [recipientId]);

  return (
    <div className="flex h-screen">
  {/* Left: User list */}
  <div className="w-1/3 border-r overflow-y-auto p-4">
    <h2 className="text-lg font-bold mb-4">Users</h2>
    {allUsers.map((u) => (
      <div
        key={u._id}
        onClick={() => {
          setSelectedUser(u);
          setMessages([]); // clear old chat
        }}
        className="cursor-pointer py-2 px-3 hover:bg-gray-200 rounded"
      >
        {u.name || u.email}
      </div>
    ))}
  </div>

  {/* Right: Chat area */}
  <div className="w-2/3 p-4 flex flex-col">
    {selectedUser ? (
      <>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Chat with {selectedUser.name || selectedUser.email}
        </h2>

        <div className="flex-grow overflow-y-auto mb-4 border p-2 rounded bg-gray-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.senderId === user.user._id ? "text-right" : "text-left"
              }`}
            >
              <span className="inline-block px-3 py-1 bg-blue-200 rounded">
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow px-3 py-2 border rounded"
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </>
    ) : (
      <div className="text-gray-500">Select a user to start chatting</div>
    )}
  </div>
</div>

  );
};

export default Chat;
