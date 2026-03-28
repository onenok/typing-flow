"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logining, setLogining] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  useEffect(() => {
      if (user && !loading) {
        router.push('/');
        // router.replace('/') 也可以，視需求而定
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
    setLogining(true);
    setError("");

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message || "登入失敗");
    } else {
      // redirect to main page
      router.push('/');
    }
    setLogining(false);
  };

  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          登入
        </h1>
        <form onSubmit={handleSubmit}>
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
            disabled={logining}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {logining? "登入中..." : "登入"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          還沒有帳戶？{' '}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            立即註冊
          </Link>
        </div>
      </div>
    </div>
  );
}