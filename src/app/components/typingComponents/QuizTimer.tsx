// src\app\components\typingComponents\QuizTimer.tsx
import Link from "next/link";
import { useTyping } from "./TypingProvider";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function QuizTimer() {
  const { timeLeft, tMode, isComplete } = useTyping();

  if (tMode !== "quiz") return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center mb-6">
      <div className={`
      inline-flex items-center gap-2
      ${timeLeft <= 10 ? "bg-red-50 text-red-600 animate-pulse" : (timeLeft <= 30 ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600")}
      px-6 py-2 rounded-full font-mono text-xl font-semibold
      `}>
        <span>⏱</span>
        <span>
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1">剩餘時間</p>
    </div>
  );
}
