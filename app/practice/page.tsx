"use client";

import { useAuth } from "../../lib/contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { createTypingSession, createTypingDetails } from "../../lib/db/typing-sessions";
import Link from "next/link";

export default function PracticePage() {
  const { user, loading } = useAuth();
  const [text, setText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [session, setSession] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);

  const sampleText = `abcdefghijklmnopqrstuvwxyz 1234567890!@#$%^&*()_+-= The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.`;

  useEffect(() => {
    setText(sampleText);
    setTypedText("");
    setCharIndex(0);
    setErrors(0);
    setStartTime(null);
    setIsComplete(false);
  }, []);



  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log("Key pressed");
    if (loading || isComplete) return;
    console.log("loaded and not complete");
    if (!startTime) {
      setStartTime(Date.now());
    }
    console.log("started");

    const expectedChar = text[charIndex];
    const typedChar = e.key;

    console.log(`Key pressed: ${e.key} \nExpected char: ${expectedChar} \nCurrent index: ${charIndex} \nTyped text so far: ${typedText}`);

    if (typedChar === expectedChar) {
      setCharIndex(prev => prev + 1);
      setTypedText(prev => prev + typedChar);
    } else if (typedChar.length === 1) {
      setErrors(prev => prev + 1);
    }

    if (charIndex + 1 >= text.length) {
      completeSession();
    }
  }, [text, charIndex, typedText, loading, isComplete]);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      console.log("Cleaning up event listener");
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  const completeSession = async () => {
    if (!startTime) return;

    const duration = (Date.now() - startTime) / 1000;
    const totalChars = text.length;
    const correctChars = totalChars - errors;
    const wpm = (correctChars / 5) / (duration / 60);
    const accuracy = (correctChars / totalChars) * 100;

    if (user) {
      const sessionData = {
        user_id: user.id,
        mode: "practice" as const,
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
        const details = text.split("").map((char, index) => ({
          session_id: newSession.id,
          char_index: index,
          expected_char: char,
          typed_char: typedText[index] || "",
          is_correct: char === (typedText[index] || ""),
          time_ms: 0, // 簡化，實際應用中應記錄每個字符的時間
        }));

        await createTypingDetails(details);
        setIsComplete(true);
      }
    }
    else {
      setIsComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">載入中...{'loading: ' + (loading ? 'true' : 'false')} {'user: ' + (user ? user.id : 'null')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          練習模式
        </h1>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              練習文本：
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

          <div className="grid grid-cols-2 gap-4 mb-8">
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
                  ? Math.round(((charIndex) / (charIndex + errors)) * 100)
                  : 0}
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setText(sampleText);
                setTypedText("");
                setCharIndex(0);
                setErrors(0);
                setStartTime(null);
                setIsComplete(false);
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mr-4"
            >
              重新開始
            </button>
            {isComplete && session && (
              <Link href={`/results/${session.id}`} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                查看結果
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}