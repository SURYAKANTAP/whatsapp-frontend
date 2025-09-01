// context/SocketContext.jsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Import Auth context
import { jwtDecode } from 'jwt-decode';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useAuth(); // Get the auth token

  useEffect(() => {
    if (token) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL);
      setSocket(newSocket);

      // --- NEW LOGIC: ANNOUNCE USER IS ONLINE ---
      const decodedToken = jwtDecode(token);
      newSocket.on('connect', () => {
        newSocket.emit('goOnline', decodedToken.user.id);
      });

      return () => newSocket.close();
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};