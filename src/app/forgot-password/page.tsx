'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaEnvelope } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { startGlobalLoader, stopGlobalLoader } = useAuth();

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    startGlobalLoader();

    try {
      // This Supabase function sends the password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }
      
      setMessage('If an account exists for this email, a password reset link has been sent.');
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      stopGlobalLoader();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600">Enter your email to receive a reset link.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
          {message && <p className="text-sm text-center text-green-700 bg-green-100 p-3 rounded-lg">{message}</p>}
          {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input id="email-address" name="email" type="email" autoComplete="email" required
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <button type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md">
              Send Reset Link
            </button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
