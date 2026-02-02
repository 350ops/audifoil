import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/database.types';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Required for Google Sign-in to work properly
WebBrowser.maybeCompleteAuthSession();

// Demo mode - enabled via environment variable
const DEMO_MODE_ENABLED = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';
const DEMO_STORAGE_KEY = '@audifoil_demo_mode';
const DEMO_PROFILE_KEY = '@audifoil_demo_profile';

// Demo user data
const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'maldives@audifoil.com',
  app_metadata: {},
  user_metadata: { full_name: 'Demo User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

const DEMO_PROFILE: Profile = {
  id: 'demo-user-id',
  email: 'maldives@audifoil.com',
  first_name: 'Demo',
  last_name: 'User',
  avatar_url: null,
  location: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

type Profile = Tables<'profiles'>;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  demoModeAvailable: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  signInWithGoogleToken: (idToken: string) => Promise<{ error: Error | null }>;
  signInAsDemo: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  updateDemoProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if demo mode was previously active
    const checkDemoMode = async () => {
      if (DEMO_MODE_ENABLED) {
        const demoActive = await AsyncStorage.getItem(DEMO_STORAGE_KEY);
        if (demoActive === 'true') {
          setIsDemoMode(true);
          setUser(DEMO_USER);

          // Load saved demo profile or use default
          const savedProfile = await AsyncStorage.getItem(DEMO_PROFILE_KEY);
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          } else {
            setProfile(DEMO_PROFILE);
          }

          setIsLoading(false);
          return true;
        }
      }
      return false;
    };

    // Get initial session
    const initAuth = async () => {
      const isDemo = await checkDemoMode();
      if (isDemo) return;

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignore auth changes if in demo mode
        if (isDemoMode) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
    setIsLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    return { error: null };
  };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      }

      return { error: new Error('No identity token received') };
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // User cancelled
        return { error: null };
      }
      return { error: e };
    }
  };

  const signInWithGoogleToken = async (idToken: string) => {
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  const signInAsDemo = async () => {
    if (!DEMO_MODE_ENABLED) {
      return { error: new Error('Demo mode is not enabled') };
    }

    try {
      await AsyncStorage.setItem(DEMO_STORAGE_KEY, 'true');
      setIsDemoMode(true);
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  const signOut = async () => {
    // Clear demo mode if active
    if (isDemoMode) {
      await AsyncStorage.removeItem(DEMO_STORAGE_KEY);
      await AsyncStorage.removeItem(DEMO_PROFILE_KEY);
      setIsDemoMode(false);
      setUser(null);
      setProfile(null);
      router.replace('/screens/welcome');
      return;
    }

    await supabase.auth.signOut();
    setProfile(null);
    router.replace('/screens/welcome');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    // Use demo profile update if in demo mode
    if (isDemoMode) {
      return updateDemoProfile(updates);
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      return { error };
    }

    // Refresh profile after update
    await fetchProfile(user.id);
    return { error: null };
  };

  const updateDemoProfile = async (updates: Partial<Profile>) => {
    if (!isDemoMode) {
      return { error: new Error('Not in demo mode') };
    }

    try {
      const updatedProfile: Profile = {
        ...DEMO_PROFILE,
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await AsyncStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);

      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isDemoMode,
        demoModeAvailable: DEMO_MODE_ENABLED,
        signUp,
        signIn,
        signInWithApple,
        signInWithGoogleToken,
        signInAsDemo,
        signOut,
        updateProfile,
        updateDemoProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
