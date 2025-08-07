// frontend/src/components/ConversationList.jsx (SIMPLIFIED)
import React from "react";
import ConversationItem from "./ConversationItem";
import { IoSearchOutline } from "react-icons/io5";
import { RiChatNewLine } from "react-icons/ri";
import { BsThreeDotsVertical } from 'react-icons/bs';

// This component is now simple. It receives data, it does not fetch it.
const ConversationList = ({ conversations, onSelectConversation }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <header className="px-4 py-3 border-gray-300 flex items-center justify-between mx-2">
        <h2 className="text-xl font-semibold text-green-600">WhatsApp</h2>
        <div className="flex items-center gap-4">
         <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <RiChatNewLine size={24} />
          
        </div>
        <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
        <BsThreeDotsVertical size={20} className="cursor-pointer"/>
        </div>
        </div>
      </header>
      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 mx-6">
        <div>
          <IoSearchOutline size={20} className="text-gray-500" />
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {conversations && conversations.length > 0 ? (
          conversations.map((convo) => (
            <ConversationItem
              key={convo.wa_id}
              conversation={convo}
              onSelect={onSelectConversation}
            />
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">
            No conversations found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
