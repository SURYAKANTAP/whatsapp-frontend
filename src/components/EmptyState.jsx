import React from 'react'
 import { IoLockClosed } from "react-icons/io5"; 

const EmptyState = () => {
  return (
   // Import the lock icon

// ... inside your component

// This is the new component to show when no chat is selected.
<div className="flex flex-col items-center justify-center h-full w-full bg-[#F7F5F3] p-10 text-center border-l border-slate-200">
  
  {/* Image Container */}
  <div className="relative mb-5">
    {/* Laptop Image */}
    <img 
      src="/desktop.png" 
      alt="WhatsApp on Laptop" 
      className="w-80 h-auto"
    />
    
  </div>

  {/* Text Content */}
  <div className="flex flex-col items-center gap-y-4">
    <h1 className="text-4xl text-[#41525D]">Download WhatsApp for Windows</h1>
    <p className="max-w-md text-slate-500">
      Make calls, share your screen and get a faster experience when you download the Windows app.
    </p>
    <button className="bg-[#00A884] text-white px-8 py-2 rounded-full mt-4 hover:bg-[#069377] transition-colors cursor-pointer">
      Download
    </button>
  </div>
  
  {/* Spacer to push the footer text down */}
  {/* <div className="flex-grow"></div> */}

  {/* Footer Security Text */}
  <div className="flex items-center gap-x-2 text-slate-500 text-sm mt-20">
    <IoLockClosed />
    <span>Your personal messages are end-to-end encrypted</span>
  </div>

</div>
  )
}

export default EmptyState