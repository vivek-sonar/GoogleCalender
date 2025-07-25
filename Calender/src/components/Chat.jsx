import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import { FaCheck, FaCheckDouble, FaArrowLeft } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";

const socket = io("http://localhost:5000");

const Chat = ({ user }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [unseenMessages, setUnseenMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const messagesEndRef = useRef(null);

  const currentUserId = user.user._id;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/getallusers");
      const otherUsers = res.data.filter((u) => u._id !== currentUserId);
      setAllUsers(otherUsers);

      const unseenCounts = {};
      for (const u of otherUsers) {
        try {
          const res = await axios.post("http://localhost:5000/messages/getmsg", {
            senderId: currentUserId,
            recipientId: u._id,
          });
          const msgs = res.data;
          if (msgs.length > 0) {
            const lastMsg = msgs[msgs.length - 1];
            setLastMessages((prev) => ({ ...prev, [u._id]: lastMsg }));
            let unseenCount = 0;
            for (let i = msgs.length - 1; i >= 0; i--) {
              if (
                msgs[i].senderId === u._id &&
                msgs[i].recipientId === currentUserId &&
                !msgs[i].seen
              ) {
                unseenCount++;
              } else {
                break;
              }
            }
            unseenCounts[u._id] = unseenCount;
          }
        } catch (err) {
          console.error("Error fetching last message:", err);
        }
      }
      setUnseenMessages(unseenCounts);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const res = await axios.post("http://localhost:5000/messages/getmsg", {
        senderId: currentUserId,
        recipientId: selectedUser._id,
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const markMessagesAsSeen = async () => {
    if (!selectedUser) return;
    try {
      await axios.post("http://localhost:5000/messages/markseen", {
        senderId: selectedUser._id,
        recipientId: currentUserId,
      });
      setUnseenMessages((prev) => ({ ...prev, [selectedUser._id]: 0 }));
      fetchMessages();
    } catch (err) {
      console.error("Error marking messages as seen:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;
    const messageData = {
      senderId: currentUserId,
      recipientId: selectedUser._id,
      text,
    };
    try {
      await axios.post("http://localhost:5000/messages/sendmsg", messageData);
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, { ...messageData, seen: false, createdAt: new Date() }]);
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
    if (selectedUser) markMessagesAsSeen();

    socket.on("receiveMessage", (data) => {
      if (data.senderId === selectedUser?._id && data.recipientId === currentUserId) {
        setMessages((prev) => [...prev, data]);
        markMessagesAsSeen();
      } else if (data.recipientId === currentUserId) {
        setLastMessages((prev) => ({ ...prev, [data.senderId]: data }));
        setUnseenMessages((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1,
        }));
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTimeLabel = (timestamp) => {
    if (!timestamp) return "";
    const messageDate = moment(timestamp);
    const today = moment();
    const yesterday = moment().subtract(1, "day");
    if (messageDate.isSame(today, "day")) return "Today";
    if (messageDate.isSame(yesterday, "day")) return "Yesterday";
    return messageDate.format("DD MMM");
  };

  const goBackToUsers = () => {
    setSelectedUser(null);
    setShowProfile(false);
  };



const sortedUsers = [...allUsers]
  .map((user) => {
    const lastMsg = lastMessages[user._id];
    return {
      ...user,
      lastMessageTime: lastMsg ? new Date(lastMsg.createdAt).getTime() : 0,
    };
  })
  .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
  .filter((u) => u.name?.toLowerCase().includes(searchQuery.toLowerCase()));


  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Left Panel - Users List */}
      <div
        className={`w-full lg:w-1/3 border-r overflow-y-auto p-4 ${isMobileView && selectedUser ? "hidden" : "block"
          }`}
      >
        <h2 className="text-2xl font-semibold mb-4 px-2">Chats</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-full bg-gray-100"
        />



        {sortedUsers.map((u) => {

            const lastMsg = lastMessages[u._id];
            const previewText = lastMsg?.text || "Say hi 👋";
            const timeLabel = lastMsg?.createdAt ? getTimeLabel(lastMsg.createdAt) : "";
            const unseenCount = unseenMessages[u._id] || 0;

            return (
              <div
                key={u._id}
                onClick={() => {
                  setSelectedUser(u);
                  setShowProfile(false);
                }}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 hover:rounded-lg transition border-b"
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
                  {unseenCount > 0 && selectedUser?._id !== u._id && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      {unseenCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Right Panel - Chat Area */}
      <div
        className={`w-full lg:w-2/3 p-6 flex flex-col bg-white shadow-md rounded-lg relative ${isMobileView && !selectedUser ? "hidden" : "block"
          }`}
      >
        {selectedUser ? (
          <>
            <div
              className="flex items-center gap-4 border-b pb-4 mb-3 shadow-sm cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              {isMobileView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goBackToUsers();
                  }}
                  className="text-2xl text-gray-500"
                >
                  <FaArrowLeft />
                </button>
              )}
              {!isMobileView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(null);
                  }}
                  className="text-2xl text-gray-500"
                >
                  ←
                </button>
              )}
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

            {/* Profile Popup */}
            {showProfile && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-full shadow-xl w-80 h-80 flex flex-col items-center">
                  <img
                    src={selectedUser.profilePic || "https://via.placeholder.com/100"}
                    alt={selectedUser.name}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-2">{selectedUser.name}</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="mt-6 text-sm text-purple-600 hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto space-y-3">
              {messages.map((msg, index) => {
                const isSender = msg.senderId === currentUserId;
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

                    <div
                      className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"
                        }`}
                    >
                      {!isSender && (
                        <img
                          src={selectedUser.profilePic || "https://via.placeholder.com/30"}
                          alt="profile"
                          className="w-6 h-6 rounded-full"
                        />
                      )}

                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl text-sm relative 
                        ${isSender ? "bg-green-400 text-white self-end" : "bg-purple-500 text-white self-start"}`}
                      >
                        <div className="flex justify-between items-end gap-2">
                          <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                          <div className="flex items-end gap-1 text-[10px] opacity-80 whitespace-nowrap self-end">
                            <span>{moment(msg.createdAt).format("hh:mm A")}</span>
                            {isSender && (msg.seen ? <FaCheckDouble /> : <FaCheck />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 mt-4 border-t pt-4">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-grow px-4 py-2 text-sm rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 shadow-sm transition-all duration-300 placeholder-gray-500"
                placeholder="Write a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                aria-label="Send Message"
              >
                <LuSendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400 m-auto text-lg">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;