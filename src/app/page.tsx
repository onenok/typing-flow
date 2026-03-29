"use client"
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext"
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";

export default function Home() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    )
  }

  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            歡迎來到 Typing Flow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            一個功能強大的打字練習平台，幫助您提升打字速度和準確率
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">練習模式</h2>
            <p className="text-gray-600 mb-4">
              自由練習各種文本，提升打字速度和準確率
            </p>
            <Link
              href="/practice"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              開始練習
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">測驗模式</h2>
            <p className="text-gray-600 mb-4">
              參加定時測驗，挑戰自己的極限
            </p>
            <Link
              href="/quiz"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              開始測驗
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">歷史記錄</h2>
            <p className="text-gray-600 mb-4">
              查看您的練習記錄和進步曲線
            </p>
            <Link
              href="/results"
              className="inline-block bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              查看結果
            </Link>
          </div>
        </div>
        {!user &&
          (
            <div className="text-center">
              <p className="text-gray-500">
                需要帳戶？{' '}
                <Link href="/auth/register" className="text-blue-500 hover:underline">
                  立即註冊
                </Link>
              </p>
            </div>
          )
        }
      </main>
    </div>
  );
}