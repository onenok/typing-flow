"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useState, useCallback, useEffect } from "react";
import TypingModule from "@/app/components/typingComponents/TypingModule";
import Link from "next/link";
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";
import { QuizLEVELS, QLevel } from "@/lib/levels";
import TypingSummary from "@/app/components/typingComponents/TypingSummary";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function QuizClient() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<QLevel | null>(null);

  const searchParams = useSearchParams();
  const paramLevel = searchParams.get("level");
  // 如果 URL 中有 level 參數，嘗試找到對應的關卡並設置為選中
  useEffect(() => {
    if (paramLevel) {
      const foundLevel = QuizLEVELS.find(l => l.id === paramLevel);
      if (foundLevel) {
        setSelectedLevel(foundLevel);
      }
    }
  }, [paramLevel]);

  const handleSelectLevel = (level: QLevel) => {
    setSelectedLevel(level);
    router.push(`?level=${level.id}`);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    router.push(window.location.pathname);
  };

  const handleNextLevel = useCallback(() => {
    if (!selectedLevel) return;
    const nextIndex = QuizLEVELS.findIndex(l => l.id === selectedLevel.id) + 1;
    if (nextIndex < QuizLEVELS.length) {
      setSelectedLevel(QuizLEVELS[nextIndex]);
    } else {
      setSelectedLevel(null);
    }
  }, [selectedLevel]);

  if (loading) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        {!selectedLevel ? (
          <>
            <h1 className="text-4xl font-black text-center mb-4 text-blue-600">
              選擇關卡
            </h1>
            <p className="text-center text-gray-500 mb-12">
              從基礎開始，一步步提升你的倉頡打字速度吧！
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {QuizLEVELS.map((level) => (
                <div
                  key={level.id}
                  onClick={() => handleSelectLevel(level)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white p-8 shadow-md transition-all hover:scale-105 hover:shadow-xl border border-gray-100"
                >
                  <div className={`absolute top-0 right-0 m-4 h-3 w-3 rounded-full ${level.difficulty === 'easy' ? 'bg-green-400' :
                    level.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />

                  <div className="flex items-start justify-between mb-4 text-xs font-bold uppercase tracking-widest text-blue-500">
                    <span>Level {level.id}</span>
                    <h3 className="text-sm font-bold align-text-top text-blue-500 uppercase">
                      time limit: <span className="text-red-500">{level.timeLimitS}</span>秒
                    </h3>
                  </div>

                  <h2 className="mb-2 text-2xl font-black text-gray-800">
                    {level.title}
                  </h2>

                  <p className="mb-6 text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                    {level.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      難度: {
                        level.difficulty === 'easy' ? '基礎' :
                          level.difficulty === 'medium' ? '中階' : '進階'
                      }
                    </span>
                    <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-blue-700">
                      開始挑戰
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handleBackToLevels}
                className="flex items-center text-sm text-nowrap font-bold text-gray-500 hover:text-blue-600 transition-colors"
              >
                <span className="mr-2 text-nowrap">←</span> 返回關卡列表
              </button>
              <div className="text-right">
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">正在測驗</div>
                <div className="text-xl font-black text-gray-800">{selectedLevel.title}</div>
              </div>
            </div>
            <TypingModule
              key={selectedLevel.id}
              title={selectedLevel.title}
              initialText={selectedLevel.text}
              tMode="quiz"
              timeoutS={selectedLevel.timeLimitS}
              onNextLevel={handleNextLevel}
              onBackToLevels={handleBackToLevels}
            />
          </div>
        )}
      </main>
    </div>
  );
}