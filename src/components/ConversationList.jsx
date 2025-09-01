// frontend/src/components/ConversationList.jsx (SIMPLIFIED)
import React,{ useState, useEffect, useRef } from "react";
import ConversationItem from "./ConversationItem";

import { RiChatNewLine } from "react-icons/ri";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoSearchOutline, IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5"; 
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook
import { jwtDecode } from "jwt-decode"; // Import the JWT decoder
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";

// This component is now simple. It receives data, it does not fetch it.
const ConversationList = ({ onSelectConversation, onShowProfile }) => {

 const [combinedList, setCombinedList] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // State for online users
   const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- NEW STATE FOR PROFILE MODAL AND USER EMAIL ---
  
  const [currentUserEmail, setCurrentUserEmail] = useState("");

    const { token, logout } = useAuth();
    const router = useRouter(); // Hook for navigation
  const menuRef = useRef(null); // Ref for the menu to detect outside clicks


   // 1. Fetch conversations and all users
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const currentUserId = decodedToken.user.id;
        // --- NEW: EXTRACT AND SET CURRENT USER'S EMAIL ---
        setCurrentUserEmail(decodedToken.user.email);
        console.log("Current User Email:", decodedToken.user.email);

        // Fetch both datasets in parallel for performance
        const [convosRes, usersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`)
        ]);

        // --- INTELLIGENT MERGING LOGIC ---
        const activeConvos = convosRes.data;
        const allUsers = usersRes.data;

        const conversationMap = new Map();
        
        // Add active conversations first, they have priority
        activeConvos.forEach(convo => {
          conversationMap.set(convo.otherUser._id, {
            otherUserId: convo.otherUser._id,
            name: convo.otherUser.email,
            lastMessage: convo.lastMessage.text,
            lastMessageTimestamp: convo.lastMessage.timestamp,
          });
        });

        // Add other users who are NOT in an active conversation
        allUsers.forEach(user => {
          if (user._id !== currentUserId && !conversationMap.has(user._id)) {
            conversationMap.set(user._id, {
              otherUserId: user._id,
              name: user.email,
              lastMessage: "Click to start a chat",
              lastMessageTimestamp: null,
            });
          }
        });

        setCombinedList(Array.from(conversationMap.values()));
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [token]);

   

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    // Add event listener when the menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Logout handler
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  return (
    <div className="flex flex-col w-full h-full">
      <header className="px-4 py-3 border-gray-300 flex items-center justify-between mx-2">
        <h2 className="text-xl font-semibold text-green-600">WhatsApp</h2>
        <div className="flex items-center gap-4">
         <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <RiChatNewLine size={24} className="text-black cursor-pointer" />
        </div>
        {/* Menu Container */}
          <div className="relative">
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu on click
              className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <BsThreeDotsVertical size={20} className="text-black cursor-pointer" />
            </div>
            {/* Dropdown Menu - Conditionally Rendered */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
              >
                <ul className="py-1">
                   <li>
                      <button
                        onClick={() => {
                          onShowProfile({ email: currentUserEmail });
                          setIsMenuOpen(false); // Close dropdown
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                      >
                        <IoPersonCircleOutline size={20} />
                        Profile
                      </button>
                    </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                    >
                      <IoLogOutOutline size={20} />
                      Logout
                    </button>
                  </li>
                  {/* You can add more menu items here in the future */}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 mx-6">
        <div>
          <IoSearchOutline size={20} className="text-black cursor-pointer" />
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
        {combinedList.length > 0 ? (
          combinedList.map((item) => (
            <ConversationItem
              key={item.otherUserId}
              conversation={item}
              onSelect={onSelectConversation}
              isOnline={onlineUsers.includes(item.otherUserId)} // Pass online status down
            />
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No other users found.</p>
        )}
      </div>
    </div>

    
  );
};

export default ConversationList;
