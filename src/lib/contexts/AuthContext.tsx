// src\lib\contexts\AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any | null }>;
  updateProfile: (fullName?: string, avatarUrl?: string, bio?: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 使用 useMemo 確保 client 只建立一次
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return; // 防呆，雖然在 client 應該永遠有
    // 獲取初始會話
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 監聽認證狀態變化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Supabase client 未初始化") };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) return { error: new Error("Supabase client 未初始化") };
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,        // 會被 trigger 自動存到 profiles.full_name
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    if (!supabase) return { error: new Error("Supabase client 未初始化") };
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // 更新後的 updateProfile（改用 profiles 表）
  const updateProfile = async (fullName?: string, avatarUrl?: string, bio?: string) => {
    if (!supabase || !user?.id) {
      return { error: new Error("無法更新：未登入或 Supabase 未初始化") };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        bio: bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}