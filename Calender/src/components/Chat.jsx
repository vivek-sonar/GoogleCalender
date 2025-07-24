import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";

const socket = io("http://localhost:5000");

const Chat = ({ user }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // NEW: for search

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/getallusers");
      const otherUsers = res.data.filter((u) => u._id !== user.user._id);
      setAllUsers(otherUsers);

      otherUsers.forEach(async (u) => {
        try {
          const res = await axios.post("http://localhost:5000/messages/getmsg", {
            senderId: user.user._id,
            recipientId: u._id,
          });
          const msgs = res.data;
          if (msgs.length > 0) {
            const lastMsg = msgs[msgs.length - 1];
            setLastMessages((prev) => ({
              ...prev,
              [u._id]: lastMsg,
            }));
          }
        } catch (err) {
          console.error("Error fetching last message:", err);
        }
      });
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

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
    try {
      await axios.post("http://localhost:5000/messages/sendmsg", messageData);
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setText("");
      setLastMessages((prev) => ({
        ...prev,
        [selectedUser._id]: messageData,
      }));
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages();
    socket.on("receiveMessage", (data) => {
      if (data.recipientId === user.user._id) {
        setMessages((prev) => [...prev, data]);
        setLastMessages((prev) => ({
          ...prev,
          [data.senderId]: data,
        }));
      }
    });
    return () => socket.off("receiveMessage");
  }, [selectedUser]);

  const getTimeLabel = (timestamp) => {
    if (!timestamp) return "";
    const messageDate = moment(timestamp);
    const today = moment();
    const yesterday = moment().subtract(1, "day");

    if (messageDate.isSame(today, "day")) return "Today";
    if (messageDate.isSame(yesterday, "day")) return "Yesterday";
    return messageDate.format("DD MMM");
  };

  // Filter users based on search query
  const filteredUsers = allUsers.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/3 border-r overflow-y-auto p-4">
        <h2 className="text-2xl font-semibold mb-4 px-2">Chats</h2>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-full bg-gray-100"
        />

        <div className="flex space-x-2 mb-4 px-2 overflow-x-auto">
          {["Students", "Parents", "Teachers", "Admins"].map((role, i) => (
            <button
              key={i}
              className={`px-4 py-1 rounded-full border ${
                role === "Students" ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Filtered User List */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => {
            const lastMsg = lastMessages[u._id];
            const previewText = lastMsg?.text || "Say hi 👋";
            const timeLabel = lastMsg?.createdAt
              ? getTimeLabel(lastMsg.createdAt)
              : "";

            return (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition"
              >
                <div className="flex items-center">
                  <img
                    src={u.profilePic || "https://via.placeholder.com/40"}
                    alt={u.name || u.email}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{u.name || u.email}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[150px]">
                      {previewText}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span className="text-xs text-blue-600">{timeLabel}</span>
                  {lastMsg && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      2
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center mt-4">No users found</p>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-2/3 p-6 flex flex-col bg-white shadow-md rounded-lg">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b pb-4 mb-3 shadow-sm">
              <button
                onClick={() => setSelectedUser(null)}
                className="text-2xl text-gray-500"
              >
                &larr;
              </button>
              <img
                src={selectedUser.profilePic || "https://via.placeholder.com/40"}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-base font-semibold">{selectedUser.name}</h2>
                <p className="text-xs text-gray-500">Tap here for contact info</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto space-y-3">
              {messages.map((msg, index) => {
                const isSender = msg.senderId === user.user._id;
                const showLabel =
                  index === 0 ||
                  getTimeLabel(messages[index - 1]?.createdAt) !==
                    getTimeLabel(msg.createdAt);

                return (
                  <div key={index}>
                    {showLabel && (
                      <div className="flex justify-center my-2">
                        <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full">
                          {getTimeLabel(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 max-w-xs text-sm ${
                          isSender
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Box */}
            <div className="flex items-center gap-2 mt-4 border-t pt-4">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-full bg-gray-100 text-sm"
                placeholder="Write a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 text-white px-5 py-2 rounded-full text-sm hover:bg-purple-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400 m-auto text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
