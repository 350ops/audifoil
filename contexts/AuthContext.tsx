'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import { Tables } from '@/lib/database.types';

const DEMO_MODE_ENABLED = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const DEMO_STORAGE_KEY = 'mws_demo_mode';
const DEMO_PROFILE_KEY = 'mws_demo_profile';

const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'hello@maldiveswatersports.com',
  app_metadata: {},
  user_metadata: { full_name: 'Demo User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

type Profile = Tables<'profiles'>;

const DEMO_PROFILE: Profile = {
  id: 'demo-user-id',
  email: 'hello@maldiveswatersports.com',
  first_name: 'Demo',
  last_name: 'User',
  avatar_url: null,
  location: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  demoModeAvailable: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'apple' | 'google') => Promise<{ error: Error | null }>;
  signInAsDemo: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkDemoMode = () => {
      if (DEMO_MODE_ENABLED) {
        const demoActive = localStorage.getItem(DEMO_STORAGE_KEY);
        if (demoActive === 'true') {
          setIsDemoMode(true);
          setUser(DEMO_USER);
          const savedProfile = localStorage.getItem(DEMO_PROFILE_KEY);
          setProfile(savedProfile ? JSON.parse(savedProfile) : DEMO_PROFILE);
          setIsLoading(false);
          return true;
        }
      }
      return false;
    };

    const initAuth = async () => {
      const isDemo = checkDemoMode();
      if (isDemo) return;

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error) setProfile(data);
    setIsLoading(false);
  };

  const refreshProfile = async () => { if (user) await fetchProfile(user.id); };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signInWithOAuth = async (provider: 'apple' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error as Error | null };
  };

  const signInAsDemo = async () => {
    if (!DEMO_MODE_ENABLED) return { error: new Error('Demo mode is not enabled') };
    localStorage.setItem(DEMO_STORAGE_KEY, 'true');
    setIsDemoMode(true);
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    return { error: null };
  };

  const signOut = async () => {
    if (isDemoMode) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      localStorage.removeItem(DEMO_PROFILE_KEY);
      setIsDemoMode(false);
      setUser(null);
      setProfile(null);
      router.push('/');
      return;
    }
    await supabase.auth.signOut();
    setProfile(null);
    router.push('/');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    if (isDemoMode) {
      const updatedProfile = { ...DEMO_PROFILE, ...profile, ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile as Profile);
      return { error: null };
    }
    // @ts-ignore - Supabase type narrowing issue with partial updates
    const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (!updateError) await fetchProfile(user.id);
    return { error: updateError as Error | null };
  };

  return (
    <AuthContext.Provider value={{
      session, user, profile, isLoading, isDemoMode,
      demoModeAvailable: DEMO_MODE_ENABLED,
      signUp, signIn, signInWithOAuth, signInAsDemo, signOut,
      updateProfile, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
