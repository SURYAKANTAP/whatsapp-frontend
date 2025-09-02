// frontend/src/components/ChatPanel.jsx (Refactored)
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext"; // Import our custom hook
import { IoSend, IoArrowBack } from "react-icons/io5";
import { BsCheck, BsCheckAll, BsThreeDotsVertical } from "react-icons/bs";
import { FiVideo } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { FaRegSmile } from "react-icons/fa";
import EmptyState from "./EmptyState";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

const MessageBubble = ({ msg, myUserId }) => {
  const isYou = msg.sender === myUserId;

  const statusIcon = {
    sent: <BsCheck size={18} className="text-gray-500" />,
    delivered: <BsCheckAll size={18} className="text-gray-500" />,
    read: <BsCheckAll size={18} className="text-blue-500" />,
  };
  return (
    <div className={`flex w-full ${isYou ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md p-2.5 rounded-lg shadow-sm ${
          isYou ? "bg-[#D9FDD3]" : "bg-white"
        }`}
      >
        <p className="text-sm text-gray-800">{msg.text}</p>
        <div className="flex justify-end items-center mt-1">
          <p className="text-xs text-gray-500 mr-2">
            {new Date(msg.timestamp * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {isYou && statusIcon[msg.status]}
        </div>
      </div>
    </div>
  );
};

const ChatPanel = ({ otherUserId, onBack, onHeaderClick }) => {
  const [conversationInfo, setConversationInfo] = useState(null);

  const socket = useSocket();
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUserEmail, setOtherUserEmail] = useState("Loading..."); // State for header email
  const messagesEndRef = useRef(null);

  const myUserId = token ? jwtDecode(token).user.id : null;
  // 1. Fetch initial message history when a chat is opened
  useEffect(() => {
    // Reset state when switching conversations
    setMessages([]);
    setOtherUserEmail("Loading...");
    if (otherUserId && socket) {
      const fetchChatHistory = async () => {
        try {
          const [messagesRes, userRes] = await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${otherUserId}`
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/users/${otherUserId}`
            ),
          ]);
          setMessages(messagesRes.data);
          console.log("Fetched messages:", messagesRes.data);
          // You might want to fetch the other user's info too
          // For now, we can infer it from the first message if it exists
          setOtherUserEmail(userRes.data.email);
          socket.emit("markAsRead", { otherUserId });
        } catch (error) {
          console.error("Failed to fetch message history:", error);
          setOtherUserEmail("Chat");
        }
      };
      fetchChatHistory();
    }
  }, [otherUserId, socket]);

  // 2. Listen for REAL-TIME and MISSED messages from the socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Add message only if it belongs to the currently open chat
      const involved = [newMessage.sender, newMessage.recipient];
      if (involved.includes(myUserId) && involved.includes(otherUserId)) {
        setMessages((prev) => [...prev, newMessage]);
        socket.emit("markAsRead", { otherUserId });
      }
    };
    const handleMessagesRead = (data) => {
      // Check if the update is for the conversation we currently have open
      if (data.conversationPartnerId === otherUserId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.sender === myUserId ? { ...msg, status: "read" } : msg
          )
        );
      }
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead); // Add the new listener

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, myUserId, otherUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !socket || !myUserId) return;

    socket.emit("sendMessage", {
      text: newMessage,
      sender: myUserId,
      recipient: otherUserId,
    });
    setNewMessage("");
  };

  if (!otherUserId) {
    return <EmptyState />;
  }

  return (
    <div
      className="flex flex-col h-full flex-grow"
      style={{ backgroundImage: `url('/bg-chat-tile-light.jpg')` }}
    >
      <header className="flex justify-between items-center p-3 bg-[white] border-b border-slate-200 flex-none">
        <div className="flex items-center">
          {/* STYLE: Back button that only appears on screens smaller than 'md' */}
          <div
            onClick={onBack}
            className="md:hidden mr-2 p-1 rounded-full hover:bg-slate-200 cursor-pointer"
          >
            <IoArrowBack size={22} className="text-black cursor-pointer" />
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onHeaderClick({ email: otherUserEmail })}
          >
            <div className="w-10 h-10 rounded-full mr-4">
              <img src="/user.png" alt="Avatar" />
            </div>
            <h2 className="font-medium text-slate-700 truncate">
              {/* --- MODIFICATION START --- */}

              {/* Show truncated email on mobile (screens smaller than 'md') */}
              <span className="md:hidden">
                {otherUserEmail && otherUserEmail.length > 5
                  ? `${otherUserEmail.substring(0, 5)}...`
                  : otherUserEmail}
              </span>

              {/* Show full email on desktop (screens 'md' and larger) */}
              <span className="hidden md:inline">
                {otherUserEmail || "Loading..."}
              </span>

              {/* --- MODIFICATION END --- */}
            </h2>
          </div>
        </div>
        <div className="flex items-center space-x-5 text-slate-600">
          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <FiVideo size={20} className="cursor-pointer text-black" />
          </div>
          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <IoSearch size={20} className="cursor-pointer text-black" />
          </div>
          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <BsThreeDotsVertical
              size={20}
              className="cursor-pointer text-black"
            />
          </div>
        </div>
      </header>

      <main
        className="flex-1 p-4 overflow-y-auto space-y-3"
        style={{ backgroundImage: `url('/bg-chat-tile-light.jpg')` }}
      >
        {messages.map((msg) => (
          // FIX: Pass the `conversationId` prop down to each bubble
          <MessageBubble key={msg.id} msg={msg} myUserId={myUserId} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="px-3 py-2 mx-3 my-3 rounded-full bg-[white] flex items-center space-x-1 flex-none shadow-2xl">
        <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <GrAttachment size={22} className="text-black cursor-pointer" />
        </div>
        <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <FaRegSmile size={24} className="text-black cursor-pointer" />
        </div>

        <form onSubmit={handleSendMessage} className="flex-grow">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full p-2.5 rounded-lg text-sm focus:outline-none text-gray-700"
          />
        </form>
        <button
          type="submit"
          onClick={handleSendMessage}
          className="p-2 text-slate-500 bg-green-500 rounded-3xl cursor-pointer hover:bg-green-600"
        >
          {" "}
          <IoSend size={24} color="white" />{" "}
        </button>
      </footer>
    </div>
  );
};

export default ChatPanel;
