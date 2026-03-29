"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const { signUp, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [signuping, setSignUping] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);
  if (loading) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }
  if (user) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        已登入，正在跳轉...
      </div>
    )
  }
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSignUping(true);
    setError("");
    toast.promise(
      signUp(email, password, fullName),
      {
        loading: "註冊中...",
        success: () => {
          router.push('/auth/login');
          setSignUping(false);
          return "✅註冊成功！";
        },
        error: (err) => {
          console.error("註冊失敗:", err);
          setSignUping(false);
          return `❌ 註冊失敗，請稍後再試\n${err}`;
        },
      }
    )
  };

  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          註冊
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              全名
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入全名"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              電子郵件
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入電子郵件"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密碼
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入密碼"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={signuping}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {signuping ? "註冊中..." : "註冊"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          已經有帳戶？{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            立即登入
          </Link>
        </div>
      </div>
    </div>
  );
}