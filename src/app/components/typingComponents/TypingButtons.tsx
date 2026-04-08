// src\app\components\typingComponents\Buttons.tsx
import Link from "next/link";
import { useTyping } from "./TypingProvider";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function TypingButtons() {
  const { user } = useAuth();
  const {
    reset,
    isComplete,
  } = useTyping();

  return (
    <div
      className="text-center" //grid gap-2.5
    /*
    style={{
      gridTemplateColumns: `repeat(auto-fit, minmax(0, 1fr))`
    }}
    */
    >
      <button
        disabled={isComplete}
        onClick={reset}
        className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        重新開始
      </button>
    </div >
  );
}