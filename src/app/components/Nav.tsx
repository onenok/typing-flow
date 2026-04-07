// src\app\components\Nav.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export default function Nav() {
  const { user, profile, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 max-w-dvw z-9999">
      <nav className="site-nav gap-4 max-sm:gap-2 shadow-lg max-w-dvw z-9999">
        <Link href="/" className="logo whitespace-nowrap">
          Typing Flow
        </Link>
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
            <div className="gap-6 max-sm:gap-3 flex w-full">
              <Link href="/profile" className="w-full text-gray-400 text-ellipsis overflow-hidden whitespace-nowrap text-right">
                {profile?.display_name || profile?.username || user.email || "用戶"}
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
        <div className="block sm:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="font-mono text-2xl">{isMenuOpen ? "X" : "≡"}</div>
        </div>
      </nav>
      <div className={`
        sm:hidden
        absolute top-full left-0 w-full bg-gray-800 shadow-lg border-b-
        flex flex-col items-center py-2 z-9998
        transition-all duration-300 ease-in-out 
        *:text-2xl
        *:w-full
        *:text-center
        *:border-gray-500
        *:not-last:pb-2
        *:not-last:border-b
        *:not-first:pt-2
        ${isMenuOpen
          ? 'translate-y-0'
          : '-translate-y-full pointer-events-none'
        }
      `}>
        <Link href="/" className="nav-item" onClick={() => setIsMenuOpen(false)}>
          首頁
        </Link>
        <Link href="/practice" className="nav-item" onClick={() => setIsMenuOpen(false)}>
          練習
        </Link>
        <Link href="/quiz" className="nav-item" onClick={() => setIsMenuOpen(false)}>
          測驗
        </Link>
        <Link href="/results" className="nav-item" onClick={() => setIsMenuOpen(false)}>
          結果
        </Link>
      </div>
    </div>
  );
}