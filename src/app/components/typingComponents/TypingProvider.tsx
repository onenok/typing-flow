// src\app\components\typingComponents\TypingProvider.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useTypingModule } from "@/app/hooks/useTypingModule";

type TypingContextType = ReturnType<typeof useTypingModule>;

const TypingContext = createContext<TypingContextType | null>(null);

export function TypingProvider({
  children,
  initialText = "這是一段測試文字，正常來說，你不應該看到它。",
  tMode,
  timeoutS = 60
}: {
  children: ReactNode;
  initialText?: string;
  tMode: "practice" | "quiz";
  timeoutS: number;
}) {
  const value = useTypingModule(initialText, tMode, timeoutS);

  return <TypingContext.Provider value={value}>{children}</TypingContext.Provider>;
}

export function useTyping() {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error("useTyping must be used within TypingProvider / TypingModule");
  }
  return context;
}