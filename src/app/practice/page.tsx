"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useState, useEffect, useCallback, useRef } from "react";
import { saveTypingSession, saveTypingDetails } from "@/app/typing/actions";
import Link from "next/link";

export default function PracticePage() {
  const { user, loading } = useAuth();
  const [text, setText] = useState("");
  const [typedText, setTypedText] = useState(""); //module part
  const [startTime, setStartTime] = useState<number | null>(null);//module part
  const [charIndex, setCharIndex] = useState(0);//module part
  const [errors, setErrors] = useState(0);//module part
  const [errored, setErrored] = useState(false);//module part
  const [session, setSession] = useState<any>(null);//module part
  const [isComplete, setIsComplete] = useState(false);//module part
  const [shouldKeepFocus, setShouldKeepFocus] = useState(true); // 新增：是否應保持焦點

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);

  const sampleText = `身`;

  // 初始化
  useEffect(() => {
    setText(sampleText);
    setTypedText("");
    setCharIndex(0);
    setErrors(0);
    setStartTime(null);
    setIsComplete(false);
    setShouldKeepFocus(true);
  }, []);

  // 自動聚焦（初始或完成後重新開始）
  useEffect(() => {
    if (!loading && !isComplete && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [loading, isComplete]);

  // 計算下一個字元位置，讓輸入法候選字對齊
  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    const container = document.querySelector('.typing-text-container');
    if (!container || charIndex >= text.length) return;

    const spans = container.querySelectorAll('pre');
    const currentSpan = spans[charIndex] || spans[charIndex - 1]; // 若已完成，取最後一個
    if (currentSpan) {
      const rect = currentSpan.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setCursorPosition({
        left: rect.left - containerRect.left + rect.width / 2 - 100, // 調整偏移讓候選字居中
        top: rect.top - containerRect.top - 40, // 往上偏移一點，避免蓋住文字
      });
    }
  }, [charIndex, text]);

/* module part */
const processInputChar = useCallback((char: string) => {
    console.log("processInputChar called with:", char);
    if (loading || isComplete) return;
    console.log("not loading and not complete, processing char:", char);
    if (!startTime) {
      setStartTime(Date.now());
    }
    console.log(`處理輸入字元: "${char}" at index ${charIndex}`);

    const expected = text[charIndex];

    console.log(`輸入: ${char} | 預期: ${expected} | index: ${charIndex}`);

    if (char === expected) {
      console.log("correct");
      setCharIndex((prev) => prev + 1);
      setTypedText((prev) => prev + char);
      setErrored(false);
    } else if (char.length === 1) {
      console.log("WRONG");
      setErrors((prev) => prev + 1);
      setErrored(true);
    }

    // 有輸入 → 開啟自動 focus 模式
    setShouldKeepFocus(true);

    if (!errored && charIndex + 1 >= text.length) {
      console.log("complete");
      completeSession();
    }
    else {
      console.log("not complete");
    }
  }, [text, charIndex, loading, isComplete, startTime]);

/* module part */
const handleCompositionStart = () => {
    console.log("開始組字");
    isComposing.current = true;
  };

/* module part */
const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    console.log("結束組字，組字結果:", e.data);
    isComposing.current = false;
    const composed = e.data || "";
    if (composed) {
      for (const char of composed) {
        processInputChar(char);
      }
    }
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = "";
    }
  };

/* module part */
const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (isComposing.current) return;
    console.log("輸入事件，當前值:", e.currentTarget.value);

    const value = e.currentTarget.value;
    if (value) {
      const latestChar = value.slice(-1);
      processInputChar(latestChar);
    }
    e.currentTarget.value = "";
  };

  // 當 blur 時，根據條件決定是否重新 focus
/* module part */
const handleBlur = () => {
    if (!loading && !isComplete && shouldKeepFocus && hiddenInputRef.current) {
      setTimeout(() => {
        hiddenInputRef.current?.focus();
      }, 10);
    }
  };

  const completeSession = async () => {
    if (!startTime) return;
    console.log('aaa');
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
      const newSession = await saveTypingSession(sessionData);
      if (newSession) {
        setSession(newSession);

        const details = text.split("").map((char, index) => ({
          session_id: newSession.id,
          char_index: index,
          expected_char: char,
          typed_char: typedText[index] || "",
          is_correct: char === (typedText[index] || ""),
          time_ms: 0,
        }));

        await saveTypingDetails(details);
        setIsComplete(true);
        setShouldKeepFocus(false); // 完成後關閉自動 focus
      }
    } else {
      setIsComplete(true);
      setShouldKeepFocus(false);
    }
  };

  // 監聽 Tab 鍵，短暫允許失焦（讓鍵盤使用者能導航按鈕）
  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setShouldKeepFocus(false);
        // 1 秒後如果沒有新輸入，恢復（可調整時間）
        setTimeout(() => {
          if (
            !document.activeElement?.matches(
              "button, a, input, [tabindex]:not([tabindex='-1'])"
            )
          ) {
            setShouldKeepFocus(true);
          }
        }, 1200);
      }
    };

    document.addEventListener("keydown", handleKeyDownGlobal);
    return () => document.removeEventListener("keydown", handleKeyDownGlobal);
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            載入中... loading: {loading ? "true" : "false"} user:{" "}
            {user ? user.id : "null"}
          </p>
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
          <div className="">
            <p className="text-gray-600 mb-4">練習文本：</p>
            <div className="typing-text-container relative bg-gray-100 p-4 rounded-lg text-lg min-h-[3rem]">
              {text.split("").map((char, index) => (
                <pre
                  key={index}
                  className={`inline-block ${index < charIndex
                    ? "text-green-500 bg-green-100"
                    : errored && index === charIndex
                      ? "text-red-500 bg-red-100"
                      : "text-gray-700"
                    }`}
                >
                  {char}
                </pre>
              ))}
            </div>

            {/* 隱藏 input */}
            <p className="text-gray-600 mb-4">輸入顯示：</p>
            <input
              ref={hiddenInputRef}
              type="text"
              autoFocus
              style={{
                width: "300px",
                height: "2em",
                padding: "0",
                margin: "0",
                border: "none",
                outline: "none",
                color: "black",
                fontSize: "1.25rem",
                lineHeight: "1.5",
                pointerEvents: "auto",
              }}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onInput={handleInput}
              onBlur={handleBlur}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8"> {/* module part */}
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">速度 (WPM)</p>
              <p className="text-2xl font-bold text-blue-600">
                {startTime
                  ? Math.round(
                    ((charIndex / 5) / ((Date.now() - startTime) / 60000)) *
                    100
                  ) / 100
                  : 0}
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
              onClick={(e) => {
                setText(sampleText);
                setTypedText("");
                setCharIndex(0);
                setErrors(0);
                setErrored(false);
                setStartTime(null);
                setIsComplete(false);
                setShouldKeepFocus(true);
                e.currentTarget.blur();
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mr-4"
            >
              重新開始
            </button>

          </div>
        </div>
        {isComplete && session && (
          <Link
            href={`/results`}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            查看結果
          </Link>
        )}
      </main>
    </div>
  );
}