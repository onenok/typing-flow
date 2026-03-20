// src/hooks/useTypingModule.ts
import { useState, useEffect, useCallback, useRef } from "react";

export function useTypingModule(initialText: string = "這是一段測試文字，正常來說，你不應該看到它。") {
  const [text, setText] = useState(initialText);
  const [typedText, setTypedText] = useState(""); // 用來計算正確字數與 WPM
  const [displayText, setDisplayText] = useState<string[]>([]); // 顯示用的輸入歷程（含錯字）

  const [startTime, setStartTime] = useState<number | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [errored, setErrored] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [shouldKeepFocus, setShouldKeepFocus] = useState(true);

  const TypingInputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);

  // 游標位置（給輸入法候選字對齊用）
  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });

  // 計算游標位置
  useEffect(() => {
    const container = document.querySelector(".typing-text-container");
    if (!container || charIndex >= text.length) return;

    const spans = container.querySelectorAll("pre");
    const currentSpan = spans[charIndex] || spans[charIndex - 1];
    if (currentSpan) {
      const rect = currentSpan.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setCursorPosition({
        left: rect.left - containerRect.left + rect.width / 2 - 100,
        top: rect.top - containerRect.top - 40,
      });
    }
  }, [charIndex, text]);

  // 自動聚焦（只要沒完成就保持焦點）
  useEffect(() => {
    if (!isComplete && TypingInputRef.current) {
      TypingInputRef.current.focus();
    }
  }, [isComplete]);

  const processInputChar = useCallback(
    (char: string) => {
      if (isComplete) return;
      if (!startTime) setStartTime(Date.now());

      const expected = text[charIndex];
      const newDisplay = [...displayText];

      if (char === expected) {
        // 正確輸入 → 綠色，並前進
        newDisplay[charIndex] = char;
        setCharIndex((prev) => prev + 1);
        setTypedText((prev) => prev + char);
        setErrored(false);
      } else if (char.length === 1) {
        // 錯誤輸入
        const lastIndex = charIndex;

        // 判斷前一個字是否也是錯字
        const prevCharIsWrong = newDisplay[lastIndex] && newDisplay[lastIndex] !== text[lastIndex];

        if (prevCharIsWrong) {
          // 連續打錯 → 取代上一個錯字
          newDisplay[lastIndex] = char;
        } else {
          // 上一個是正確的 → 新增錯字
          newDisplay[lastIndex] = char;
        }

        setErrors((prev) => prev + 1);
        setErrored(true);
      }

      setDisplayText(newDisplay);
      setShouldKeepFocus(true);

      if (charIndex + 1 >= text.length) {
        setIsComplete(true);
      }
    },
    [text, charIndex, startTime, isComplete, displayText]
  );

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    const composed = e.data || "";
    if (composed) {
      for (const char of composed) {
        processInputChar(char);
      }
    }
    if (TypingInputRef.current) {
      TypingInputRef.current.value = "";
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (isComposing.current) return;

    const value = e.currentTarget.value;
    if (value) {
      const latestChar = value.slice(-1);
      processInputChar(latestChar);
    }
    e.currentTarget.value = "";
  };

  const handleBlur = () => {
    if (shouldKeepFocus && TypingInputRef.current) {
      setTimeout(() => {
        TypingInputRef.current?.focus();
      }, 10);
    }
  };

  const reset = () => {
    setText(initialText);
    setTypedText("");
    setCharIndex(0);
    setErrors(0);
    setErrored(false);
    setStartTime(null);
    setIsComplete(false);
    setShouldKeepFocus(true);
    setDisplayText([]);
  };

  // 計算 WPM 和準確率（給 UI 直接用）
  const wpm = startTime
    ? Math.round(((charIndex / 5) / ((Date.now() - startTime) / 60000)) * 100) / 100
    : 0;

  const accuracy = startTime && charIndex > 0
    ? Math.round((charIndex / (charIndex + errors)) * 100)
    : 0;

  return {
    text,
    typedText,
    charIndex,
    errors,
    errored,
    isComplete,
    cursorPosition,
    startTime,
    wpm,
    accuracy,
    displayText,           // 新增：給 UI 顯示輸入歷程用
    TypingInputRef,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    handleBlur,
    reset,
  };
}