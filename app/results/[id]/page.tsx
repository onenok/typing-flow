"use client";

import { useAuth } from "../../../lib/contexts/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTypingSession, getTypingDetails } from "../../../lib/db/typing-sessions";
import Link from "next/link";

export default function ResultDetailPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<any>(null);
  const [details, setDetails] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user || !sessionId) return;

    const fetchData = async () => {
      setLoadingData(true);
      const sessionData = await getTypingSession(sessionId);
      const detailsData = await getTypingDetails(sessionId);

      if (sessionData && sessionData.user_id === user.id) {
        setSession(sessionData);
        setDetails(detailsData);
      }
      setLoadingData(false);
    };

    fetchData();
  }, [user, sessionId]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">找不到結果或無權訪問</p>
          <Link href="/results" className="text-blue-500 hover:underline mt-4 inline-block">
            返回結果列表
          </Link>
        </div>
      </div>
    );
  }

  const correctCount = details.filter((d) => d.is_correct).length;
  const errorCount = details.length - correctCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          練習結果
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">總結</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">模式</p>
                <p className="text-xl font-bold text-blue-600">
                  {session.mode === "practice" ? "練習" : "測驗"}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">速度</p>
                <p className="text-xl font-bold text-green-600">
                  {Math.round(session.wpm)} WPM
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">準確率</p>
                <p className="text-xl font-bold text-purple-600">
                  {Math.round(session.accuracy)}%
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">持續時間</p>
                <p className="text-xl font-bold text-orange-600">
                  {Math.round(session.duration_seconds)}秒
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">總字符數</p>
                <p className="text-2xl font-bold text-gray-800">
                  {session.total_chars}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">正確字符</p>
                <p className="text-2xl font-bold text-green-600">
                  {session.correct_chars}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">錯誤次數</p>
                <p className="text-2xl font-bold text-red-600">
                  {session.errors}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">練習文本</h3>
              <div className="bg-gray-100 p-4 rounded-lg text-lg">
                {session.text_content.split("").map((char: string, index: number) => {
                  const detail = details.find((d) => d.char_index === index);
                  return (
                    <span
                      key={index}
                      className={`inline-block ${
                        detail?.is_correct ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">詳細記錄</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">位置</th>
                      <th className="px-4 py-2 text-left">期望字符</th>
                      <th className="px-4 py-2 text-left">輸入字符</th>
                      <th className="px-4 py-2 text-left">狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail) => (
                      <tr key={detail.id} className="border-t">
                        <td className="px-4 py-2">{detail.char_index + 1}</td>
                        <td className="px-4 py-2 font-mono">{detail.expected_char}</td>
                        <td className="px-4 py-2 font-mono">{detail.typed_char}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-white text-sm ${
                              detail.is_correct ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {detail.is_correct ? "正確" : "錯誤"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/results"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mr-4"
            >
              返回結果列表
            </Link>
            <Link
              href="/practice"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              再次練習
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}