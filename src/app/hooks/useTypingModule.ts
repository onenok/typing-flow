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

  const [charIndex, setCharIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const [errors, setErrors] = useState(0);
  const [errored, setErrored] = useState(false);

  const [isComplete, setIsComplete] = useState(false);

  // for quiz timer
  const [timeLeft, setTimeLeft] = useState<number>(timeoutS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const TypingInputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);
  const hasSavedRef = useRef(false);
  const handlingUpdate = useRef(false);

  // for debug
  useEffect(() => { console.log("=====Start!======") }, []);

  // reset func
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
    setTimeLeft(timeoutS);
    setIsTimerRunning(false);
    hasSavedRef.current = false;
    handlingUpdate.current = false;
  };

  // ==================== Quiz Timer Effect ====================
  useEffect(() => {
    // only runs in quiz
    if (tMode !== "quiz" || !isTimerRunning) return;

    const timer = setInterval(() => {
      handlingUpdate.current = true;
      setTimeLeft((prev) => {
        // stop counting when isComplete == true
        if (isComplete) {
          setIsTimerRunning(false);
          return prev; // keep curr time
        }

        if (prev <= 1) {
          // timeout → End the quiz, set isCompleted = true
          setIsComplete(true);
          setIsTimerRunning(false);
          return 0;
        }

        return prev - 1;
      });
      handlingUpdate.current = false;
    }, 1000);

    // 
    return () => clearInterval(timer);
  }, [tMode, isTimerRunning, isComplete]);

  // start timer when user start typing（quiz mode）
  useEffect(() => {
    if (tMode === "quiz" && startTime && !isTimerRunning) {
      setTimeLeft(timeoutS);
      setIsTimerRunning(true);
    }
  }, [tMode, startTime, isTimerRunning, timeoutS]);

  // ==================== calc WPM & Accuracy ====================
  useEffect(() => {
    handlingUpdate.current = true;
    if (!startTime) return;
    setWpm(Math.round(((charIndex / 5) / ((Date.now() - startTime) / 60000)) * 100) / 100);
    setAccuracy(charIndex > 0 ? Math.round((charIndex / (charIndex + errors)) * 100) : 0);

    handlingUpdate.current = false;
  }, [startTime, charIndex, errors]);


  // ==================== Typing handling ====================
  const processInputChar = useCallback((char: string) => {
    if (isComplete) return;
    if (!startTime) setStartTime(Date.now());

    const expected = text[charIndex];
    const newDisplay = [...displayText];

    if (char === expected) { // Correct ✅
      newDisplay[displayIndex] = [char, true];
      setCharIndex(prev => prev + 1);
      setDisplayIndex(prev => prev + 1);
      setTypedText(prev => prev + char);
      setErrored(false);
    }
    else if (char.length === 1) { // Wrong ❌
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


  // ==================== Finished handling ====================
  useEffect(() => {
    if (!isComplete || !user?.id || !startTime || loading || hasSavedRef.current || handlingUpdate.current) return;
    hasSavedRef.current = true;

    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    const session = {
      user_id: user.id,
      mode: mode,
      text_type: "cangjie",
      text_content: text,
      duration_seconds: durationSeconds,
      total_chars: text.length,
      correct_chars: charIndex,
      errors: errors,
      wpm: wpm,
      accuracy: accuracy,
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
          return "❌ 儲存失敗，請稍後再試: " + err;
        },
      }
    );
  }, [
    isComplete,
    user?.id,
    mode,
    text,
    startTime,
    charIndex,
    errors,
    wpm,
    accuracy,
    loading,
    hasSavedRef.current,
    handlingUpdate.current
  ]);

  return {
    text,
    tMode,
    timeoutS,
    timeLeft,
    isTimerRunning,
    typedText,
    charIndex,
    displayIndex,
    errors,
    errored,
    startTime,
    wpm,
    accuracy,
    displayText,
    TypingInputRef,
    isComplete,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    reset,
  };
}