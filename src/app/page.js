// frontend/src/app/page.js
import React from 'react';
import axios from 'axios';
import HomeClient from '@/components/HomeClient'; // Import the new client component



// page.js is now an async Server Component.
export default async function Home() {

  // We pass the server-fetched data down to our new client-side "gatekeeper".
  return <HomeClient />;
}