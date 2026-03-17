"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useState } from "react";

export default function Nav() {
  const { user, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <nav className="site-nav">
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
          <>
            <Link href="/profile" className="nav-item">
              {user?.user_metadata?.full_name || user?.email}
            </Link>
            <button
              onClick={async () => {
                await signOut();
                setIsMenuOpen(false);
              }}
              className="nav-item"
            >
              登出
            </button>
          </>
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