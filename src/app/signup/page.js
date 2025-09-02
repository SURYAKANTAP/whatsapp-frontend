// frontend/src/app/signup/page.js
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Use login to set the token after signup
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/signup`;
      const response = await axios.post(apiUrl, { email, password });
      
      // Log the user in immediately after successful signup
      login(response.data.token);

      // Redirect to the main chat page
      router.push('/');
    } catch (err) {
      setError('Failed to create account. Email may already be in use.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-4">
                  <Image
                    src="/whatsapplogo.png" // The path starts from the public folder
                    alt="WhatsApp Logo"
                    width={80}      // Required property for layout stability
                    height={80}     // Required property for layout stability
                    priority        // Optional: Tells Next.js to load this image first
                  />
                </div>
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          Create your Account
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;