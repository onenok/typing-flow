// src\app\hooks\useTypingModule.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { saveTypingDetails, saveTypingSession } from "@/app/typing/actions";
import { toast } from "sonner";

export function useTypingModule(
  initialText: string = "這是一段測試文字，正常來說，你不應該看到它。",
  tMode: "practice" | "quiz",
  timeoutS: number = 60,
) {
  const { user, loading } = useAuth();

  const [mode, setMode] = useState(tMode);
  const [text, setText] = useState(initialText);
  const [typedText, setTypedText] = useState("");
  const [displayText, setDisplayText] = useState<[string, boolean][]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [errored, setErrored] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const TypingInputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    console.log("=====Start!======")
  }, []);

  // 計算 WPM 和準確率
  useEffect(() => {
    if (!startTime) return;
    setWpm(Math.round(((charIndex / 5) / ((Date.now() - startTime) / 60000)) * 100) / 100);
    setAccuracy(charIndex > 0 ? Math.round((charIndex / (charIndex + errors)) * 100) : 0);
  }, [startTime, charIndex, errors]);

  // === 打字完成後儲存到資料庫 ===
  useEffect(() => {
    if (!isComplete || !user?.id || !startTime || loading || hasSavedRef.current) return;
    hasSavedRef.current = true;

    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    const session = {
      user_id: user.id,
      mode,
      text_type: "cangjie",
      text_content: text,
      duration_seconds: durationSeconds,
      total_chars: text.length,
      correct_chars: charIndex,
      errors,
      wpm,
      accuracy,
    };

    console.log("準備儲存打字記錄:", session);

    toast.promise(
      saveTypingSession(session),
      {
        loading: "正在儲存打字記錄...",
        success: (result) => {
          if (result) {
            return "✅ 打字記錄已成功儲存！";
          }
          return "儲存完成";
        },
        error: (err) => {
          console.error("儲存失敗:", err);
          return "❌ 儲存失敗，請稍後再試: "+err;
        },
      }
    );
  }, [
    isComplete,   // 最重要的觸發條件
    user?.id,     // 必須監聽
    mode,
    text,
    startTime,
    charIndex,
    errors,
    wpm,
    accuracy,
    loading
  ]);

  // ==================== 輸入處理 ====================
  const processInputChar = useCallback((char: string) => {
    if (isComplete) return;
    if (!startTime) setStartTime(Date.now());

    const expected = text[charIndex];
    const newDisplay = [...displayText];

    if (char === expected) {
      newDisplay[displayIndex] = [char, true];
      setCharIndex(prev => prev + 1);
      setDisplayIndex(prev => prev + 1);
      setTypedText(prev => prev + char);
      setErrored(false);
    } else if (char.length === 1) {
      const lastDisplayIndex = displayIndex - 1;
      const prevCharIsNotWrong = displayText[lastDisplayIndex]?.[1] ?? true;

      if (!prevCharIsNotWrong) {
        newDisplay[displayIndex - 1] = [char, false];
      } else {
        newDisplay[displayIndex] = [char, false];
        setDisplayIndex(prev => prev + 1);
      }
      setErrors(prev => prev + 1);
      setErrored(true);
    }

    setDisplayText(newDisplay);

    if (charIndex + 1 >= text.length) {
      console.log("=====End!======")
      setIsComplete(true);
    }
  }, [text, charIndex, startTime, isComplete, displayText, displayIndex]);

  const handleCompositionStart = () => { isComposing.current = true; };
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    const composed = e.data || "";
    if (composed) {
      for (const char of composed) processInputChar(char);
    }
    if (TypingInputRef.current) TypingInputRef.current.value = "";
  };

  const handleInput = (e: React.InputEvent<HTMLInputElement>) => {
    if (isComposing.current) return;
    const value = e.currentTarget.value;
    if (value) processInputChar(value.slice(-1));
    e.currentTarget.value = "";
  };

  const reset = () => {
    console.log("=====Start!======")
    setText(initialText);
    setTypedText("");
    setCharIndex(0);
    setDisplayIndex(0);
    setErrors(0);
    setErrored(false);
    setStartTime(null);
    setIsComplete(false);
    setDisplayText([]);
    hasSavedRef.current = false;
  };

  return {
    text,
    typedText,
    charIndex,
    displayIndex,
    errors,
    errored,
    isComplete,
    startTime,
    wpm,
    accuracy,
    displayText,
    TypingInputRef,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    reset,
  };
}