// src/hooks/useTypingModule.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { saveTypingDetails, saveTypingSession } from "@/app/typing/actions";
export function useTypingModule(
  initialText: string = "這是一段測試文字，正常來說，你不應該看到它。",
  tMode: "practice" | "quiz",
  timeoutS: number = 60,
) {
  //
  const { user, loading } = useAuth()
  //
  const [mode, setMode] = useState(tMode)

  const [text, setText] = useState(initialText);
  const [typedText, setTypedText] = useState(""); // 用來計算正確字數與 WPM
  const [displayText, setDisplayText] = useState<[string, boolean][] | []>([]); // 顯示用的輸入歷程（含錯字）

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

  // 計算 WPM 和準確率（給 UI 直接用）
  useEffect(() => {
    setWpm(
      startTime
        ? Math.round(((charIndex / 5) / ((Date.now() - startTime) / 60000)) * 100) / 100
        : 0
    );
    setAccuracy(
      startTime && charIndex > 0
        ? Math.round((charIndex / (charIndex + errors)) * 100)
        : 0
    );
  }, [startTime, charIndex, errors])

  useEffect(() => {
    console.log("=====Start!======")
  }, [])
  useEffect(() => {
    //
    if (!isComplete || !user || !startTime || loading) return;

    //
    const error = saveTypingSession({
      user: user,
      mode: mode,
      text_content: text,
      duration_seconds: Date.now() - startTime,
      total_chars: text.length,
      correct_chars: charIndex,
      errors: errors,
      wpm: wpm,
      accuracy: accuracy,
    })
  }, [isComplete, accuracy, wpm, errors, user, mode, text, startTime, charIndex]);
  
  /*
  idk how the fuck it do, it for, it works.
  useEffect(() => {
    //
    if ( !user || !startTime || loading) return;

    //
    saveTypingDetails({
      session_id: ,
      char_index: ,
      expected_char: ,
      typed_char: ,
      is_correct: ,
      time_ms: ,
    })
  }, [isComplete, accuracy, wpm, errors, user, mode, text, startTime, charIndex]);
  */
  const processInputChar = useCallback(
    (char: string) => {
      if (isComplete) return;
      if (!startTime) setStartTime(Date.now());

      const expected = text[charIndex];
      const newDisplay = [...displayText];

      if (char === expected) {
        // 正確輸入 → 綠色，並前進
        newDisplay[displayIndex] = [char, true];
        setCharIndex((prev) => prev + 1);
        setDisplayIndex((prev) => prev + 1);
        setTypedText((prev) => prev + char);
        setErrored(false);
      } else if (char.length === 1) {
        // 錯誤輸入
        const lastDisplayIndex = displayIndex - 1;
        const prevCharIsNotWrong = displayText[lastDisplayIndex] ? displayText[lastDisplayIndex][1] : true;
        if (!prevCharIsNotWrong) {
          console.log("replace old wrong")
          // 連續打錯 → 取代上一個錯字
          newDisplay[displayIndex - 1] = [char, false];
        } else {
          console.log("add new wrong")
          // 上一個是正確的 → 新增錯字
          newDisplay[displayIndex] = [char, false];
          setDisplayIndex((prev) => prev + 1);
        }

        setErrors((prev) => prev + 1);
        setErrored(true);
      }

      setDisplayText(newDisplay);

      if (charIndex + 1 >= text.length) {
        console.log("=====Complete!======")
        setIsComplete(true);
      }
    },
    [text, charIndex, startTime, isComplete, displayText]
  );

  const handleCompositionStart = () => {
    isComposing.current = true;
    console.log("Start Composing")
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    const composed = e.data || "";
    if (composed) {
      for (const char of composed) {
        processInputChar(char);
      }
      console.log("End Composing")
    }
    if (TypingInputRef.current) {
      TypingInputRef.current.value = "";
    }
  };

  const handleInput = (e: React.InputEvent<HTMLInputElement>) => {
    if (isComposing.current) return;

    const value = e.currentTarget.value;
    if (value) {
      const latestChar = value.slice(-1);
      processInputChar(latestChar);
    }
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
    displayText,           // 新增：給 UI 顯示輸入歷程用
    TypingInputRef,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    reset,
  };
}