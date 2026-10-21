'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { insforge } from '../../lib/insforge';

interface UserProfile {
  name?: string;
  avatar_url?: string;
  xp?: number;
  coins?: number;
  streak?: number;
  level?: number;
  solved_ids?: number[];
  badges?: string[];
}

interface AuthContextType {
  user: any | null;
  loading: boolean;
  profile: UserProfile | null;
  isAdmin: boolean;
  signUp: (params: any) => Promise<{ data: any; error: any }>;
  signIn: (params: any) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  updateProfileStats: (stats: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile details from database table `user_stats`
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await insforge.database
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user stats profile:', error);
        return;
      }

      if (data) {
        setProfile({
          name: user?.profile?.name || 'Coder',
          avatar_url: user?.profile?.avatar_url || '',
          xp: data.xp,
          coins: data.coins,
          streak: data.streak,
          level: data.level,
          solved_ids: Array.isArray(data.solved_ids) ? data.solved_ids : [],
          badges: Array.isArray(data.badges) ? data.badges : []
        });
      } else {
        // Create initial stats in database
        const newStats = {
          user_id: userId,
          xp: 100, // starting gift
          coins: 10,
          streak: 1,
          level: 1,
          solved_ids: [],
          badges: ['Newbie']
        };

        const { data: insertedData, error: insertError } = await insforge.database
          .from('user_stats')
          .insert([newStats])
          .select()
          .single();

        if (!insertError && insertedData) {
          setProfile({
            name: user?.profile?.name || 'Coder',
            avatar_url: user?.profile?.avatar_url || '',
            xp: insertedData.xp,
            coins: insertedData.coins,
            streak: insertedData.streak,
            level: insertedData.level,
            solved_ids: insertedData.solved_ids,
            badges: insertedData.badges
          });
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
          await fetchUserProfile(data.user.id);
        }
      } catch (err) {
        console.error('Error checking user session:', err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [user?.id]);

  const signUp = async (params: any) => {
    setLoading(true);
    const { data, error } = await insforge.auth.signUp(params);
    if (!error && data?.user) {
      setUser(data.user);
      if (data.accessToken) {
        await fetchUserProfile(data.user.id);
      }
    }
    setLoading(false);
    return { data, error };
  };

  const signIn = async (params: any) => {
    setLoading(true);
    let { data, error } = await insforge.auth.signInWithPassword(params);
    
    // Auto signup for admin credentials if they don't exist yet
    if (error && params.email === 'manojnarala245@gmail.com') {
      const signupRes = await insforge.auth.signUp({
        email: params.email,
        password: params.password,
        name: 'Manoj N'
      });
      if (!signupRes.error && signupRes.data?.user) {
        // Try logging in again
        const retry = await insforge.auth.signInWithPassword(params);
        data = retry.data;
        error = retry.error;
      }
    }

    if (!error && data?.user) {
      setUser(data.user);
      await fetchUserProfile(data.user.id);
    }
    setLoading(false);
    return { data, error };
  };


  const signOut = async () => {
    setLoading(true);
    const { error } = await insforge.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
    return { error };
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  const updateProfileStats = async (stats: Partial<UserProfile>) => {
    if (!user?.id) return;
    
    // Map properties from camelCase local state to snake_case DB fields
    const dbPayload: any = {};
    if (stats.xp !== undefined) dbPayload.xp = stats.xp;
    if (stats.coins !== undefined) dbPayload.coins = stats.coins;
    if (stats.streak !== undefined) dbPayload.streak = stats.streak;
    if (stats.level !== undefined) dbPayload.level = stats.level;
    if (stats.solved_ids !== undefined) dbPayload.solved_ids = stats.solved_ids;
    if (stats.badges !== undefined) dbPayload.badges = stats.badges;

    const { error } = await insforge.database
      .from('user_stats')
      .update(dbPayload)
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...stats } : null);
    } else {
      console.error('Error updating user stats in database:', error);
    }
  };

  const isAdmin = Boolean(user && (user.email === 'manojnarala245@gmail.com' || user?.profile?.role === 'Admin'));

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      profile,
      isAdmin,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      updateProfileStats
    }}>
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
