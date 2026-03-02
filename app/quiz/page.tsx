"use client";

import { useAuth } from "../../lib/contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { createTypingSession, createTypingDetails } from "../../lib/db/typing-sessions";
import Link from "next/link";

export default function QuizPage() {
  const { user, loading } = useAuth();
  const [text, setText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [session, setSession] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60秒測驗
  const [quizActive, setQuizActive] = useState(false);

  const sampleTexts = [
    `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.`,
    `Programming is the art of telling a computer what to do. Good code is like a good story - it should be clear and easy to follow.`,
    `In the middle of difficulty lies opportunity. Don't be afraid to fail, because failure is just a stepping stone to success.`,
    `Technology is best when it brings people together. The most profound technologies are those that disappear into the background.`,
    `Practice makes perfect. The more you practice, the better you become. Consistency is key to mastering any skill.`
  ];

  useEffect(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setTypedText("");
    setCharIndex(0);
    setErrors(0);
    setStartTime(null);
    setIsComplete(false);
    setTimeLeft(60);
    setQuizActive(false);
  }, []);

  // 計時器
  useEffect(() => {
    if (!quizActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizActive, timeLeft]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (loading || isComplete || !quizActive) return;

    if (!startTime) {
      setStartTime(Date.now());
      setQuizActive(true);
    }

    const expectedChar = text[charIndex];
    const typedChar = e.key;

    if (typedChar === expectedChar) {
      setCharIndex(prev => prev + 1);
      setTypedText(prev => prev + typedChar);
    } else if (typedChar.length === 1) {
      setErrors(prev => prev + 1);
    }

    if (charIndex + 1 >= text.length) {
      completeSession();
    }
  };

  const startQuiz = () => {
    setQuizActive(true);
    setStartTime(Date.now());
  };

  const completeSession = async () => {
    if (!startTime) return;

    const duration = 60 - timeLeft; // 實際使用的時間
    const totalChars = charIndex;
    const correctChars = totalChars - errors;
    const wpm = (correctChars / 5) / (duration / 60);
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;

    if (user) {
      const sessionData = {
        user_id: user.id,
        mode: "quiz" as const,
        text_type: "sentences",
        text_content: text,
        duration_seconds: duration,
        total_chars: totalChars,
        correct_chars: correctChars,
        errors,
        wpm,
        accuracy,
      };

      const newSession = await createTypingSession(sessionData);
      if (newSession) {
        setSession(newSession);

        // 創建詳細記錄
        const details = text.split("").slice(0, charIndex).map((char, index) => ({
          session_id: newSession.id,
          char_index: index,
          expected_char: char,
          typed_char: typedText[index] || "",
          is_correct: char === (typedText[index] || ""),
          time_ms: 0, // 簡化，實際應用中應記錄每個字符的時間
        }));

        await createTypingDetails(details);
        setIsComplete(true);
        setQuizActive(false);
      }
    }
    else {
      setIsComplete(true);
      setQuizActive(false);
    }
  };

  const resetQuiz = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setTypedText("");
    setCharIndex(0);
    setErrors(0);
    setStartTime(null);
    setIsComplete(false);
    setTimeLeft(60);
    setQuizActive(false);
    setSession(null);
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          測驗模式
        </h1>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <div className="text-6xl font-bold text-red-500 mb-4">
              {timeLeft}
            </div>
            <p className="text-gray-600">
              {quizActive ? "測驗進行中..." : "準備開始"}
            </p>
          </div>

          {!quizActive && !isComplete && (
            <div className="text-center mb-8">
              <button
                onClick={startQuiz}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition text-lg"
              >
                開始測驗
              </button>
              <p className="text-gray-500 mt-4">
                你有60秒時間輸入盡可能多的字符
              </p>
            </div>
          )}

          {quizActive && (
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                測驗文本：
              </p>
              <div className="bg-gray-100 p-4 rounded-lg text-lg">
                {text.split("").map((char, index) => (
                  <span
                    key={index}
                    className={`inline-block ${index < charIndex ? "text-green-500" : "text-gray-700"
                      }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {quizActive && (
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                已輸入：
              </p>
              <div className="bg-gray-100 p-4 rounded-lg text-lg">
                {typedText.split("").map((char, index) => (
                  <span
                    key={index}
                    className={`inline-block ${char === text[index] ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {char}
                  </span>
                ))}
                {charIndex < text.length && (
                  <span className="text-gray-400">
                    {text.slice(charIndex)}
                  </span>
                )}
              </div>
            </div>
          )}

          {quizActive && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">速度 (WPM)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {startTime ? Math.round(((charIndex / 5) / ((Date.now() - startTime) / 60000)) * 100) / 100 : 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">準確率 (%)</p>
                <p className="text-2xl font-bold text-green-600">
                  {startTime && charIndex > 0
                    ? Math.round(((charIndex - errors) / charIndex) * 100)
                    : 0}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">字符數</p>
                <p className="text-2xl font-bold text-purple-600">
                  {charIndex}/{text.length}
                </p>
              </div>
            </div>
          )}
          {quizActive &&
          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              重新開始
            </button>
            {isComplete && session && (
              <Link href={`/results/${session.id}`} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                查看結果
              </Link>
            )}
          </div>
          }
        </div>
      </main>
    </div>
  );
}