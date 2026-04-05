// src\app\hooks\useTypingModule.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { saveTypingDetails, saveTypingSession } from "@/app/typing/actions";
import { toast } from "sonner";
import { TypingSession } from "@/lib/db/typing-sessions";

const combineTextAndWrongTypeds = (Text: string[], WrongTypeds: string[], currCharIndex: number): [string, number][] => { // 0: red, 1: green, 2: yellow
  return Text.flatMap((item, index) => [[item, WrongTypeds[index-1]?.[0] ? 2 : 1], [WrongTypeds[index][0], 0]]);
};

export function useTypingModule(
  initialText: string = "這是一段測試文字，正常來說，你不應該看到它。",
  tMode: "practice" | "quiz",
  timeoutS: number = 60,
) {
  const { user, loading } = useAuth();

  const [mode, setMode] = useState(tMode);

  const [text, setText] = useState(initialText);

  const [displayText, setDisplayText] = useState<[string, number][]>([]);

  const [charIndex, setCharIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeOfEachChar, setTimeOfEachChar] = useState<number[]>(new Array(initialText.length).fill(-1));
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  const [correctChars, setCorrectChars] = useState(0);
  const [errors, setErrors] = useState(0);
  const [errored, setErrored] = useState(false);
  const [errorInputs, setErrorInputs] = useState<string[]>(new Array(initialText.length + 1).fill(""));

  const [isComplete, setIsComplete] = useState(false);

  // for quiz timer
  const [timeLeft, setTimeLeft] = useState<number>(timeoutS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const TypingInputRef = useRef<HTMLInputElement>(null);
  const compositionStartTimeRef = useRef<number | null>(null);
  const totalStartTimeRef = useRef<number | null>(null);

  const isComposing = useRef(false);
  const hasSavedRef = useRef(false);
  const handlingUpdate = useRef(false);
  const isTimerRunningRef = useRef(isTimerRunning);

  // for debug
  useEffect(() => { console.log("=====Start!======") }, []);

  // reset func
  const reset = () => {
    console.log("=====Start!======")
    setText(initialText);
    setCharIndex(0);
    setDisplayIndex(0);
    setErrors(0);
    setErrored(false);
    setErrorInputs(new Array(initialText.length + 1).fill(""));
    setStartTime(null);
    setLastTime(null);
    setTimeOfEachChar(new Array(initialText.length).fill(-1));
    setWpm(0);
    setAccuracy(0);
    setIsComplete(false);
    setDisplayText([]);
    setTimeLeft(timeoutS);
    setIsTimerRunning(false);
    compositionStartTimeRef.current = null;
    totalStartTimeRef.current = null;
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

  // ==================== calc WPM & Accuracy ====================
  const calculateWpmAndAccuracy = useCallback((startTime: number, charIndex: number, errors: number) => {
    if (!startTime) return { wpm: 0, accuracy: 0, completionRate: 0 };

    const currentWpm = Math.round(((charIndex / 5) / ((Date.now() - startTime) / 60000)) * 100) / 100;
    const currentAccuracy = charIndex > 0
      ? Math.round((charIndex / (charIndex + errors)) * 100)
      : 0;

    const currentCompletionRate = Math.round((charIndex / text.length) * 100);

    return { wpm: currentWpm, accuracy: currentAccuracy, completionRate: currentCompletionRate };
  }, [startTime, charIndex, errors]);

  // ==================== Typing handling ====================
  const processInputChar = useCallback((char: string, compositeStartTime: number | null = null) => {
    if (isComplete) return;
    const nowTime = Date.now();
    const typeStartTime = totalStartTimeRef.current || Date.now();
    if (!startTime) {
      setTimeLeft(timeoutS);
      setIsTimerRunning(true);
      setStartTime(typeStartTime);
      setLastTime(typeStartTime);
    };
    handlingUpdate.current = true;

    const startTimeUse = startTime || typeStartTime;
    const lastTimeUse = lastTime || typeStartTime;
    const expected = text[charIndex];
    const newTimeOfEachChar = [...timeOfEachChar];
    const newErrorInputs = [...errorInputs];
    if (!newErrorInputs[charIndex]) newErrorInputs[charIndex] = "";

    let newErrored = errored;
    let newErrors = errors;
    let newCharIndex = charIndex;

    if (char === expected) { // Correct ✅
      newTimeOfEachChar[charIndex] = nowTime - lastTimeUse;
      newErrored = false;
      setCorrectChars((prev) => {
        if (newErrorInputs[charIndex]!== "") return prev; // already has error input, don't count as correct char
        return prev + 1;
      });
      newCharIndex += 1;
      setLastTime(nowTime);
    }
    else if (char.length === 1) { // Wrong ❌
      newErrorInputs[charIndex] = char + newErrorInputs[charIndex];
      newErrored = true;
      newErrors += 1;
    }

    console.log(newErrorInputs)

    const newDisplay = combineTextAndWrongTypeds(
      ["", ...text.split("").slice(0, newCharIndex)],
      newErrorInputs,
      newCharIndex
    )
    const { wpm: newWpm, accuracy: newAccuracy, completionRate: newCompletionRate } = calculateWpmAndAccuracy(
      startTimeUse, newCharIndex, newErrors
    );

    setWpm(newWpm);
    setAccuracy(newAccuracy);
    setCompletionRate(newCompletionRate);
    setTimeOfEachChar(newTimeOfEachChar);
    setDisplayIndex(newDisplay.length);
    setDisplayText(newDisplay);
    setErrors(newErrors);
    setErrored(newErrored);
    setErrorInputs(newErrorInputs);
    setCharIndex(newCharIndex);

    if (newCharIndex >= text.length) {
      console.log("=====End!======")
      setIsComplete(true);
    }
    handlingUpdate.current = false;
  }, [text, charIndex, startTime, isComplete, displayText, displayIndex]);

  const handleCompositionStart = () => {
    isComposing.current = true;
    const nowTime = Date.now();
    compositionStartTimeRef.current = nowTime;
    if (!totalStartTimeRef.current) totalStartTimeRef.current = nowTime
  };
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    const composed = e.data || "";
    if (composed) {
      for (const char of composed) processInputChar(char, compositionStartTimeRef.current);
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
    if (!isComplete || !user?.id ||!lastTime || !startTime || loading || hasSavedRef.current || handlingUpdate.current) return;
    hasSavedRef.current = true;

    const durationSeconds = Math.round((lastTime - startTime) / 1000 * 100) / 100;

    const session = {
      user_id: user.id,
      mode: mode,
      text_type: "cangjie",
      text_content: text,
      duration_seconds: durationSeconds,
      total_chars: text.length,
      typed_chars: charIndex,
      correct_chars: correctChars,
      errors: errors,
      wpm: wpm,
      accuracy: accuracy,
      completionRate: completionRate,
    };

    console.log("準備儲存打字記錄:", session);

    toast.promise(
      saveTypingSession(session),
      {
        loading: "正在儲存打字記錄...",
        success: (result) => {
          if (result) {
            console.log("打字記錄已成功儲存")
            return "✅ 打字記錄已成功儲存！";
          }
          return "儲存完成";
        },
        error: (err) => {
          console.error("儲存失敗:", err);
          return "❌ 儲存失敗，請稍後再試: " + err;
        },
      }
    ).unwrap().then((result: TypingSession) => {
      const session_id = result.id;
      const details = text.split("").map((char, index) => {
        const expected_char = char;
        const char_index = index;
        const isTyped = index < charIndex;
        const wrong_types = errorInputs[index];
        const is_correct = wrong_types == "" ? true : false;
        const time_ms = timeOfEachChar[index]
        return {
          session_id: session_id,
          char_index: char_index,
          expected_char: expected_char,
          isTyped: isTyped,
          wrong_types: wrong_types,
          is_correct: is_correct,
          time_ms: time_ms,
        }
      });
      console.log(details);
      toast.promise(
        saveTypingDetails(details),
        {
          loading: "正在儲存細節記錄...",
          success: (result) => {
            if (result) {
              console.log("細節記錄已成功儲存")
              return "✅ 細節記錄已成功儲存！";
            }
            return "儲存完成";
          },
          error: (err) => {
            console.error("儲存失敗:", err);
            return "❌ 儲存失敗，請稍後再試: " + err;
          },
        }
      )
    })
  }, [
    isComplete,
    user?.id,
    mode,
    text,
    startTime,
    lastTime,
    timeOfEachChar,
    charIndex,
    errorInputs,
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
    charIndex,
    displayIndex,
    errors,
    errored,
    errorInputs,
    startTime,
    wpm,
    accuracy,
    completionRate,
    displayText,
    TypingInputRef,
    isComplete,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    reset,
  };
}