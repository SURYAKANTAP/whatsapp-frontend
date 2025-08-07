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
import ContactInfoPanel from "./ContactInfoPanel";

const MessageBubble = ({ msg, conversationId }) => {
  // This logic correctly determines if the message is from you or the other user.
  // The 'status' field is only added to messages sent from our own UI.
  console.log(
    `Message: "${msg.text}", From: ${msg.from}, isYou: ${
      msg.from !== conversationId
    }`
  );
  const isYou = msg.from !== conversationId;

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

const ChatPanel = ({ conversationId, onBack, onHeaderClick }) => {
  const socket = useSocket(); // Get the socket from our context
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationInfo, setConversationInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join the conversation room and request message history
    socket.emit("joinRoom", conversationId);

    // Listener for the initial message load
    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
      // console.log("Loaded messages:", loadedMessages);
      if (loadedMessages.length > 0) {
        setConversationInfo({
          name: loadedMessages[0].name,
          phone: loadedMessages[0].from,
        });
      }
    });

    // Listener for new incoming messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // --- Cleanup function to prevent memory leaks ---
    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, [socket, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !socket) return;

    // No more optimistic UI needed, the server is the source of truth
    socket.emit("sendMessage", {
      wa_id: conversationId,
      text: newMessage,
    });
    setNewMessage("");
  };

  if (!conversationId) {
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
            <IoArrowBack size={22} className="text-slate-600" />
          </div>
          <div className="flex items-center cursor-pointer" onClick={() => onHeaderClick(conversationInfo)}>
            <div className="w-10 h-10 rounded-full mr-4">
              <img src="/user.png" alt="Avatar" />
            </div>
            <h2 className="font-medium text-slate-700">
              {conversationInfo?.name || "Loading..."}
            </h2>
          </div>
        </div>
        <div className="flex items-center space-x-5 text-slate-600">
          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <FiVideo size={20} className="cursor-pointer" />
          </div>
          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <IoSearch size={20} className="cursor-pointer" />
          </div>
          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <BsThreeDotsVertical size={20} className="cursor-pointer" />
          </div>
        </div>
      </header>

      <main
        className="flex-1 p-4 overflow-y-auto space-y-3"
        style={{ backgroundImage: `url('/bg-chat-tile-light.jpg')` }}
      >
        {messages.map((msg) => (
          // FIX: Pass the `conversationId` prop down to each bubble
          <MessageBubble
            key={msg.id}
            msg={msg}
            conversationId={conversationId}
          />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="px-3 py-2 mx-3 my-3 rounded-full bg-[white] flex items-center space-x-1 flex-none shadow-2xl">
        <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <GrAttachment size={22} className="text-slate-500 cursor-pointer" />
        </div>
        <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <FaRegSmile size={24} className="text-slate-500 cursor-pointer" />
        </div>

        <form onSubmit={handleSendMessage} className="flex-grow">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full p-2.5 rounded-lg text-sm focus:outline-none"
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
