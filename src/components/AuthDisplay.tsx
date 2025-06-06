'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { useState } from 'react';

export default function AuthDisplay() {
  const { user, session, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    window.location.href = '/';
  };

  if (isLoading || isSigningOut) {
    return (
      <div className="flex items-center justify-center px-3 py-1.5">
        <FaSpinner className="animate-spin h-5 w-5 text-indigo-500" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email;

  return (
    <div className="flex items-center space-x-3">
      {user && session ? (
      <>
        <span className="text-sm text-gray-700 hidden md:inline font-bold">
          Welcome, {displayName}!
        </span>
        <button onClick={handleSignOut}
          className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 rounded-lg shadow-sm transition duration-150 ease-in-out"
          title="Logout">
          <FaSignOutAlt className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </>
      ) : (
      <>
        <Link href="/login"
          className="flex items-center px-3 py-2 text-sm font-medium text-indigo-700 hover:text-indigo-800 bg-indigo-100 hover:bg-indigo-200 rounded-lg shadow-sm transition duration-150 ease-in-out">
          <FaSignInAlt className="mr-1.5 h-4 w-4" />
          Log In
        </Link>
        <Link href="/signup"
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105">
          <FaUserPlus className="mr-1.5 h-4 w-4" />
          Sign Up
        </Link>
      </>
      )}
    </div>
  );
}
