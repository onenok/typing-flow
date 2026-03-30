"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setError("");


    toast.promise(
      updateProfile(fullName, avatarUrl),
      {
        loading: "更新中...",
        success: () => {
          setLoadingUpdate(false);
          return "✅更新成功！";
        },
        error: (err) => {
          console.error("更新失敗:", err);
          setError(err.message || "更新失敗");
          setLoadingUpdate(false);
          return `❌ 更新失敗，請稍後再試\n${err}`;
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">請先登入</p>
          <Link href="/auth/login" className="text-blue-500 hover:underline mt-4 inline-block">
            立即登入
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          個人資料
        </h1>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <img
                  src={avatarUrl || "/user-avatar.svg"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-2 border-gray-300"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.user_metadata?.full_name || user.email}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  全名
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入全名"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  頭像網址
                </label>
                <input
                  type="url"
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入頭像圖片網址"
                />
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loadingUpdate}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loadingUpdate ? "更新中..." : "更新個人資料"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}