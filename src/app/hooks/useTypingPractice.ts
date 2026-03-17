// src/hooks/useTypingPractice.ts
import { useState, useEffect, useCallback, useRef } from "react";

export function useTypingPractice(initialText: string = "這是一段測試文字，正常來說，你不應該看到它。") {
  const [text, setText] = useState(initialText);
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [errored, setErrored] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [shouldKeepFocus, setShouldKeepFocus] = useState(true);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
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
    if (!isComplete && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [isComplete]);

  const processInputChar = useCallback(
    (char: string) => {
      if (isComplete) return;
      if (!startTime) setStartTime(Date.now());

      const expected = text[charIndex];

      if (char === expected) {
        setCharIndex((prev) => prev + 1);
        setTypedText((prev) => prev + char);
        setErrored(false);
      } else if (char.length === 1) {
        setErrors((prev) => prev + 1);
        setErrored(true);
      }

      setShouldKeepFocus(true);

      if (charIndex + 1 >= text.length) {
        setIsComplete(true);
      }
    },
    [text, charIndex, startTime, isComplete]
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
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = "";
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
    if (shouldKeepFocus && hiddenInputRef.current) {
      setTimeout(() => {
        hiddenInputRef.current?.focus();
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
  };

  // 計算 WPM 和準確率（給 UI 直接用）
  const wpm = startTime
    ? Math.round(((charIndex / 5) / ((Date.now() - startTime) / 60000)) * 100) / 100
    : 0;

  const accuracy = startTime && charIndex > 0
    ? Math.round((charIndex / (charIndex + errors)) * 100)
    : 0;

  return {
    // 狀態
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

    // refs & event handlers
    hiddenInputRef,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    handleBlur,

    // 方法
    reset,
  };
}