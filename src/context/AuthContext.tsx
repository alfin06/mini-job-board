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
  refreshUser: () => Promise<void>;
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

  // Function to fetch the initial user session
  const fetchUserSession = async () => {
    setIsLoading(true);
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error.message);
    }
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setIsLoading(false);
  };

  useEffect(() => {
    // Fetch the initial session
    fetchUserSession();

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
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setSession(null);
      setUser(null);
    }
    setIsLoading(false);
  };

  const refreshUser = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      setIsLoading(true);
      const { data: { user: refreshedUser }, error } = await supabase.auth.getUser();
      if (refreshedUser) {
        setUser(refreshedUser);
      }
      if (error) {
        console.error("Error manually refreshing user:", error.message);
      }
      setIsLoading(false);
    } else {
      console.log("No active user to refresh.");
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
    refreshUser,
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
