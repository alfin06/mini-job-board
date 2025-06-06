'use client';

import { useAuth } from '@/context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

export default function GlobalLoader() {
  const { isLoading } = useAuth();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
        <p className="mt-4 text-lg text-gray-800">Processing...</p>
      </div>
    </div>
  );
}
