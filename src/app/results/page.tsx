"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useState, useEffect } from "react";
import { fetchUserSessions } from "@/app/typing/actions";
import Link from "next/link";
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";

export default function ResultsPage() {
  const { user, loading } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoadingData(true);
        const sessionsData = await fetchUserSessions(user.id, 50);
        setSessions(sessionsData);
        setLoadingData(false);
      };
      fetchData();
    } else {
      setSessions([]);
      setLoadingData(false);
    }
  }, [user? user : null, loading]);

  if (loading || loadingData) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingScreen/>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <main className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            請登入帳戶以使用結果查詢功能
          </h2>
          <Link
            href="/auth/login"
          >
          </Link>
        </main>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            練習結果
          </h1>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-6">
              你還沒有任何練習記錄
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/practice"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                開始練習
              </Link>
              <Link
                href="/quiz"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                開始測驗
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          練習結果
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              統計數據
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">總會話數</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sessions.length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">平均速度</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(
                    sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length
                  )} WPM
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">平均準確率</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
                  )}%
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">最佳速度</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    Math.max(...sessions.map(s => s.wpm))
                  )} WPM
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              練習記錄
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">日期</th>
                    <th className="px-4 py-2 text-left">模式</th>
                    <th className="px-4 py-2 text-left">速度 (WPM)</th>
                    <th className="px-4 py-2 text-left">準確率 (%)</th>
                    <th className="px-4 py-2 text-left">持續時間 (秒)</th>
                    <th className="px-4 py-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-t">
                      <td className="px-4 py-2">
                        {new Date(session.created_at).toLocaleDateString("zh-TW")}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-white text-sm ${session.mode === "practice" ? "bg-blue-500" : "bg-green-500"
                            }`}
                        >
                          {session.mode === "practice" ? "練習" : "測驗"}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-bold text-blue-600">
                        {Math.round(session.wpm)}
                      </td>
                      <td className="px-4 py-2 font-bold text-green-600">
                        {Math.round(session.accuracy)}
                      </td>
                      <td className="px-4 py-2">{Math.round(session.duration_seconds)}</td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/results/${session.id}`}
                          className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition"
                        >
                          查看詳情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}