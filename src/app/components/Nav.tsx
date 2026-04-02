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
    <nav className="site-nav shadow-lg max-w-dvw">
      <div className="logo whitespace-nowrap">Typing Flow</div>
      <div className="gap-6 flex whitespace-nowrap max-sm:hidden">
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

      <div className="nav-rightest w-full">
        {loading ? (
          <div className="gap-6 flexex place-self-end w-full">
            <div className="nav-item block justify-self-end w-full text-right">載入中...</div>
          </div>
        ) : user ? (
          <div className="gap-6 flex w-full">
            <Link href="/profile" className="w-full text-ellipsis overflow-hidden whitespace-nowrap text-right">
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
              className="nav-item whitespace-nowrap"
            >
              登出
            </Link>
          </div>
        ) : (
          <div className="gap-6 flex w-full justify-end text-right whitespace-nowrap">
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