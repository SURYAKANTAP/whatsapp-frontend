// frontend/src/app/page.js

import React from 'react';
import axios from 'axios';
import ChatLayout from '@/components/ChatLayout'; // This will be our new client-side manager

// This data-fetching function now lives in page.js.
async function getConversations() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`;
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('FATAL: Could not fetch conversations on server render.', error.message);
    // If the fetch fails, we return an empty array.
    // This PREVENTS the crash loop. The page can still render.
    return [];
  }
}

// page.js is now an async Server Component.
export default async function Home() {
  // We fetch the data ONCE here.
  const initialConversations = await getConversations();

  // We pass the fetched data down to a client component that will handle all interactivity.
  return <ChatLayout initialConversations={initialConversations} />;
}