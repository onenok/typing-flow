// src\lib\contexts\AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { json } from "stream/consumers";

interface Profile {
  id: string;
  display_name?: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;

  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  withTimeout: <T>(promise: Promise<T>, timeoutMs?: number) => Promise<T>;
  //getUserProfiles: (userId: string) => Promise<any>;
  updateProfile: (displayName?: string, avatarUrl?: string, bio?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 使用 useMemo 確保 client 只建立一次
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const withTimeout = <T,>(
    promise: Promise<T>,
    timeoutMs: number = 5000 // 5s
  ): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`請求超時(超過 ${timeoutMs / 1000} 秒)，請嘗試重新加載頁面或稍後再試。`));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  };

  // 獲取 session + profile
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("獲取 profile 失敗:", error);
      return null;
    }
    return data;
  };
  const SetSessionAndProfile = async (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      const profileData = await fetchProfile(session.user.id);
      setProfile(profileData);
    } else {
      setProfile(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client 未初始化");
      return
    }; // 防呆，雖然在 client 應該永遠有
    let isMounted = true; // 防止在 component unmounted 後更新 state

    // 獲取初始會話
    supabase.auth.getSession().then(async ({ data: { session } }) => await SetSessionAndProfile(session));

    // 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) await SetSessionAndProfile(session);
    });

    // 監聽 visibility change 以刷新 session（確保在用戶回到頁面時 session 是最新的）
    const SupabaseRefreshSessionWithProfile = async () => {
      console.log("頁面 visibility changed:", document.visibilityState);
      if (document.visibilityState !== "visible" || !isMounted) {
        return; // only refresh when tab is active
      }
      console.log("正在刷新 session...");
      supabase.auth.refreshSession().then(async ({ data: { session }, error }) => {
        if (error) {
          console.warn("刷新 session 失敗，可能是因為沒有有效的 refresh token:", error);
          return;
        }
        if (session && isMounted) {
          console.log("Session 刷新成功，更新 session 和 profile");
          SetSessionAndProfile(session);
        }
      });
    }
    document.addEventListener("visibilitychange", async (event) => {
      await SupabaseRefreshSessionWithProfile();
    });

    return () => {
      console.log("AuthProvider unmounted，正在清理訂閱和事件監聽器...");
      isMounted = false;
      document.removeEventListener("visibilitychange", async (event) => {
        await SupabaseRefreshSessionWithProfile();
      });
      subscription.unsubscribe()
    };
  }, [supabase]);

  // ==================== 改成 throw error 的模式 ====================

  const signIn = async (email: string, password: string): Promise<boolean> => {
    const signInPromise = async () => {
      if (!supabase) throw new Error("Supabase client 未初始化");

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(error.message || "登入失敗");
      }
      return true;
    }
    return withTimeout(signInPromise(), 5000);
  };

  const signUp = async (email: string, password: string, username: string, displayName?: string): Promise<boolean> => {
    const signUpPromise = async () => {
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
    return withTimeout(signUpPromise(), 5000);
  };

  const signOut = async (): Promise<boolean> => {
    const signOutPromise = async () => {
      if (!supabase) throw new Error("Supabase client 未初始化");

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message || "登出失敗");
      }
      return true;
    }
    return withTimeout(signOutPromise(), 5000);
  };

  /* 
    const get User Pro files = async (userId: string): Promise<any> => {
      if (!supabase) throw new Error("Supabase client 未初始化");
      const { data, error } = await supabase
        .from("pro files")
        .select("*")
        .eq("id", userId)
        .single();
   
      if (error) {
        let message = "無法取得用戶資料";
        throw new Error(message + error.message);
      }
   
      return data;
    }
  */

  const updateProfile = async (
    displayName?: string,
    avatarUrl?: string,
    bio?: string
  ): Promise<boolean> => {
    const updateProfilePromise = async () => {
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
        console.error("update 發生錯誤:", error);
        throw new Error(error.message || "更新個人資料失敗");
      }

      const latestProfile = await fetchProfile(user.id);
      setProfile(latestProfile);

      return true;
    };
    return withTimeout(updateProfilePromise(), 5000);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        withTimeout,
        //getUserProfiles,
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