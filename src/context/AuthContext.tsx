'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  startGlobalLoader: () => void;
  stopGlobalLoader: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const startGlobalLoader = () => setIsLoading(true);
  const stopGlobalLoader = () => setIsLoading(false);

  useEffect(() => {
    // Initial session fetch
    const fetchInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    fetchInitialSession();

    // Set up the auth state change listener.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === 'SIGNED_IN') {
          router.refresh();
        }
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    startGlobalLoader();
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
    startGlobalLoader,
    stopGlobalLoader,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};