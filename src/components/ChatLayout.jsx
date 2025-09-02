// frontend/src/components/ChatLayout.jsx (NEW FILE)
"use client";

import React, { useState, useEffect } from "react";
import ConversationList from "./ConversationList";
import ChatPanel from "./ChatPanel";
import { MdOutlineMessage } from "react-icons/md";
import { TbCircleDashed } from "react-icons/tb";
import { MdCampaign } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import ContactInfoPanel from "./ContactInfoPanel";
import EmptyState from "./EmptyState";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

// This component receives the initial data as a prop.
const ChatLayout = () => {
   const [selectedOtherUserId, setSelectedOtherUserId] = useState(null);
  const [isContactInfoVisible, setIsContactInfoVisible] = useState(false);
  const [currentContactInfo, setCurrentContactInfo] = useState(null);
   const [currentUserEmail, setCurrentUserEmail] = useState(""); // State for own email
   const { token } = useAuth();

    useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUserEmail(decodedToken.user.email);
    }
  }, [token]);
   useEffect(() => {
    setIsContactInfoVisible(false);
  }, [selectedOtherUserId]);
  const handleHeaderClick = (contactInfo) => {
    setCurrentContactInfo(contactInfo);
    setIsContactInfoVisible((prev) =>
      prev && currentContactInfo?.email === contactInfo.email ? false : true
    );
  };


   // This new function is for showing OUR OWN profile
  const handleShowProfile = (profileInfo) => {
    setCurrentContactInfo(profileInfo);
    setIsContactInfoVisible(true); // Always open it when the button is clicked
  };
  const handleCloseContactInfo = () => {
    setIsContactInfoVisible(false); // Hide the panel
  };
  const handleSelectConversation = (otherUserId) => {
    setSelectedOtherUserId(otherUserId);
  };
   const isMyProfile = currentContactInfo?.email === currentUserEmail;
  return (
    <main className="flex h-screen bg-white overflow-hidden">
      <div className="md:flex hidden flex-col w-20 border-r border-slate-200 items-center py-5 justify-between bg-gray-50">
        <div className="flex flex-col gap-4 items-center">
          {/* Wrap each icon in a div for padding and background */}
          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <MdOutlineMessage size={26} className="text-gray-600 cursor-pointer" />
          </div>

          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <TbCircleDashed size={26} className="text-gray-600 cursor-pointer" />
          </div>

          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <MdCampaign size={26} className="text-gray-600 cursor-pointer" />
          </div>

          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <HiOutlineUserGroup size={26} className="text-gray-600 cursor-pointer" />
          </div>
        </div>
        <div className=" justify-center items-center flex flex-col gap-6">
          <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <IoSettingsOutline size={26} className="text-gray-600 cursor-pointer" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-300 cursor-pointer">
            <img src="/user.png" alt="Avatar" />
          </div>
        </div>
      </div>
      <div className={`
          flex-shrink-0 w-full md:w-80 lg:w-96
          ${selectedOtherUserId || isContactInfoVisible ? "hidden" : "flex"} md:flex
          border-r border-slate-200
      `}>
        <ConversationList
          onSelectConversation={handleSelectConversation}
           onShowProfile={handleShowProfile}
        />
      </div>
      <div className="flex-1 flex h-full">
        {/* STYLE: On mobile, this is shown ONLY if a chat is selected. On desktop, it's always visible. */}
        <div className={`h-full w-full ${isContactInfoVisible ? 'hidden lg:flex' : 'flex'}`}>
          {selectedOtherUserId ? (
            <ChatPanel
              otherUserId={selectedOtherUserId}
              onBack={() => setSelectedOtherUserId(null)}
              onHeaderClick={handleHeaderClick} // Pass the handler down
            />
          ) : (
            <EmptyState />
          )}
    </div>
        {isContactInfoVisible && (
           <div className="h-full w-full lg:w-96 flex-shrink-0">
            <ContactInfoPanel
             title={isMyProfile ? "Profile" : "Contact Info"}
              name={currentContactInfo?.email}
              onClose={handleCloseContactInfo}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ChatLayout;
