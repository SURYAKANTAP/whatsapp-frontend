'use client'; // This directive marks it as a Client Component

import React from 'react';

const ConversationItem = ({ conversation, onSelect, isSelected }) => {
  return (
    <div
      onClick={() => onSelect(conversation.wa_id)}
      // I've used the classes from your screenshot for accuracy
      className={"flex items-center p-4 m-3 cursor-pointer border-b border-slate-100 hover:bg-gray-100 rounded-2xl"}
    >
      <div className="w-12 h-12 rounded-full bg-gray-300 mr-3 flex-none">
        <img src="/user.png" alt="Avatar" />
      </div>

      {/* --- THE FIX IS HERE --- */}
      {/* Add 'min-w-0' to this container to allow its children to be truncated */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center">
          {/* Also truncate the name in case it's very long */}
          <h3 className=" text-gray-800 truncate">{conversation.name}</h3>
          
          {/* Add flex-shrink-0 to prevent the time from being squished */}
          <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {new Date(conversation.lastMessageTimestamp * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* This will now truncate correctly because its parent can shrink */}
        <p className="text-sm text-slate-500 truncate mt-1">
          {conversation.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;