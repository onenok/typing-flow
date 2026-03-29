// src\lib\contexts\AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName?: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  updateProfile: (fullName?: string, avatarUrl?: string, bio?: string) => Promise<boolean>;
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

  // ==================== 改成 throw error 的模式 ====================

  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) throw new Error("Supabase client 未初始化");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(error.message || "登入失敗");
    }
    return true;
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<boolean> => {
    if (!supabase) throw new Error("Supabase client 未初始化");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      throw new Error(error.message || "註冊失敗");
    }
    return true;
  };

  const signOut = async (): Promise<boolean> => {
    if (!supabase) throw new Error("Supabase client 未初始化");

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message || "登出失敗");
    }
    return true;
  };

  const updateProfile = async (
    fullName?: string,
    avatarUrl?: string,
    bio?: string
  ): Promise<boolean> => {
    if (!supabase || !user?.id) {
      throw new Error("無法更新：未登入或 Supabase 未初始化");
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

    if (error) {
      throw new Error(error.message || "更新個人資料失敗");
    }
    return true;
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