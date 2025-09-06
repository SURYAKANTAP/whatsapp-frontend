// frontend/src/components/AuthGuard.jsx
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until the loading state is settled before running any checks
    if (loading) {
      return;
    }

    const isPublicPath = pathname === '/login' || pathname === '/signup';

    // RULE 1: If the user is NOT authenticated and is trying to access a protected page
    if (!isAuthenticated && !isPublicPath) {
      router.replace('/login');
    }

    // RULE 2: If the user IS authenticated and is trying to access a public page (login/signup)
    if (isAuthenticated && isPublicPath) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router, pathname]);

  // While loading, show a loading spinner or a blank page to prevent layout flashes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* You can put a nice loading spinner component here */}
        <p>Loading...</p>
      </div>
    );
  }

  // If the user is authenticated on a private route, or unauthenticated on a public route, show the page
  return children;
};

export default AuthGuard;