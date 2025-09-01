// frontend/src/components/HomeClient.js
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ChatLayout from '@/components/ChatLayout';

const HomeClient = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the loading is complete before checking for authentication
    if (!loading && !isAuthenticated) {
      // If the user is not authenticated, redirect them to the login page
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // While the context is loading the token, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If the user is authenticated, render the chat layout
  // The redirect will happen before this is ever rendered for an unauthenticated user
  if (isAuthenticated) {
    return <ChatLayout />;
  }
  
  // Return null or a loading state while the redirect is in progress
  return null;
};

export default HomeClient;