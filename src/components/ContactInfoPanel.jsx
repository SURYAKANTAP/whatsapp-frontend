// frontend/src/components/ContactInfoPanel.jsx (New File)

import React from 'react';
import { IoClose, IoPencil } from 'react-icons/io5';

// This component receives the contact's info and a function to close it.
const ContactInfoPanel = ({ name, phone, onClose }) => {
  return (
    // Main container with a fixed width, border, and background color
    <div className="w-full flex flex-col h-full bg-white border-l border-gray-200">
      
      {/* Header */}
      <header className="flex items-center px-4 py-3 bg-white justify-between">
        <div className='flex items-center'>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 mr-4">
          <IoClose size={24} className="text-black cursor-pointer" />
        </button>
        <h2 className="text-md font-medium text-gray-800">Contact info</h2>
        </div>
        <div className='p-2 rounded-full hover:bg-gray-100'>
        <IoPencil size={23} className="text-black cursor-pointer" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto p-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-full bg-gray-300 mb-4">
            {/* Using a dummy user image from the public folder */}
            <img 
              src="/user.png" 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full" 
            />
          </div>
          <h1 className="text-2xl text-gray-900">{name || "Contact Name"}</h1>
          <p className="text-gray-500 mt-1">+{phone || "123 456 7890"}</p>
        </div>

        {/* You can add more sections like 'About', 'Media', etc. here if needed */}
        {/* For now, we are keeping it simple as requested. */}
      </div>
    </div>
  );
};

export default ContactInfoPanel;