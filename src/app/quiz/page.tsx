"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useState } from "react";
import TypingModule from "@/app/components/typingComponents/TypingModule";
import Link from "next/link";
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";

export default function QuizPage() {
  const { user, loading } = useAuth();
  const [quizActive, setQuizActive] = useState(false)
  const timeLeft = 60;

  const sampleTexts = [
    `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.`,
    `Programming is the art of telling a computer what to do. Good code is like a good story - it should be clear and easy to follow.`,
    `In the middle of difficulty lies opportunity. Don't be afraid to fail, because failure is just a stepping stone to success.`,
    `Technology is best when it brings people together. The most profound technologies are those that disappear into the background.`,
    `Practice makes perfect. The more you practice, the better you become. Consistency is key to mastering any skill.`
  ];

  const sampleText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

  const startQuiz = () => { setQuizActive(true); }

  if (loading) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8 h-full">

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          測驗模式
        </h1>

        {!quizActive && (
          <div className="
          text-center max-w-4xl
          w-full mx-auto
          bg-white rounded-lg
          shadow-lg p-8
          ">
            <h2 className="text-gray-700 mb-4 text-5xl">
              你有<span className="text-red-500">{timeLeft}秒</span>時間
            </h2>
            <h3 className="text-gray-700 mb-4 text-2xl">
              輸入盡可能多的字符
            </h3>
            <button
              onClick={startQuiz}
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition text-lg"
            >
              開始測驗
            </button>
          </div>
        )}
        {
          quizActive &&
          (
            <TypingModule title="測驗文本" initialText={sampleText} tMode="quiz" timeoutS={timeLeft} />
          )
        }
      </main>
    </div>
  );
}