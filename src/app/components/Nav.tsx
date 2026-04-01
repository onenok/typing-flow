"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export default function Nav() {
  const { user, loading, signOut, getUserProfiles } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");

  if (user) {
    (async () => {
      const Profiles = await getUserProfiles(user.id);
      setDisplayName(Profiles.display_name || "");
    })()
  }
  return (
    <nav className="site-nav shadow-lg">
      <div className="logo">Typing Flow</div>
      <div className="nav-list">
        <Link href="/" className="nav-item">
          首頁
        </Link>
        <Link href="/practice" className="nav-item">
          練習
        </Link>
        <Link href="/quiz" className="nav-item">
          測驗
        </Link>
        <Link href="/results" className="nav-item">
          結果
        </Link>
      </div>

      <div className="nav-rightest">
        {loading ? (
          <div className="nav-list">
            <div className="nav-item">載入中...</div>
          </div>
        ) : user ? (
          <div className="nav-list">
            <Link href="/profile" className="w-80 overflow-hidden whitespace-nowrap">
              {displayName || user?.email}
            </Link>
            <Link
              href={''}
              onClick={async () => {
                toast.promise(
                  signOut(),
                  {
                    loading: "登出中...",
                    success: () => {
                      setIsMenuOpen(false);
                      return "✅登出成功！";
                    },
                    error: (err) => {
                      console.error("登出失敗:", err);
                      return `❌ 登出失敗，請稍後再試\n${err}`;
                    },
                  }
                )
              }}
              className="nav-item"
            >
              登出
            </Link>
          </div>
        ) : (
          <div className="nav-list">
            <Link href="/auth/login" className="nav-item">
              登入
            </Link>
            <Link href="/auth/register" className="nav-item">
              註冊
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}