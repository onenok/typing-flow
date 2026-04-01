// src\lib\contexts\AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  getUserProfiles: (userId: string) => Promise<any>;
  updateProfile: (displayName?: string, avatarUrl?: string, bio?: string) => Promise<boolean>;
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

  const signUp = async (email: string, password: string, username: string, displayName?: string): Promise<boolean> => {
    if (!supabase) throw new Error("Supabase client 未初始化");

    // == check if username is valid ==
    if (!username || username.length < 3) {
      throw new Error("Username 至少需要 3 個字元");
    }

    // 檢查格式（只允許小寫英文、數字、下劃線）
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      throw new Error("Username 只能包含小寫英文、數字和下劃線，且長度 3-20 字元");
    }

    // 檢查 username 是否已被使用
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (checkError && checkError.code !== "PGRST116") { // PGRST116 = no rows found
      throw new Error("檢查 username 時發生錯誤");
    }

    if (existingUser) {
      throw new Error("這個 username 已經被使用了，請換一個");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          display_name: displayName,
        },
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

  const getUserProfiles = async (userId: string): Promise<any> => {
    if (!supabase) throw new Error("Supabase client 未初始化");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      let message = "無法取得用戶資料";
      throw new Error(message + error.message);
    }

    return data;
  }

  const updateProfile = async (
    displayName?: string,
    avatarUrl?: string,
    bio?: string
  ): Promise<boolean> => {
    if (!supabase) throw new Error("無法更新：未登入或 Supabase 未初始化");
    if (!user?.id) throw new Error("出現錯誤：無法獲取用戶ID, 請嘗試重新登入。");

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
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
        getUserProfiles,
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