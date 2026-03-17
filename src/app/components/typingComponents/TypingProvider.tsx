// components/typing/TypingProvider.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useTypingPractice } from "@/app/hooks/useTypingPractice";

type TypingContextType = ReturnType<typeof useTypingPractice>;

const TypingContext = createContext<TypingContextType | null>(null);

export function TypingProvider({
  children,
  initialText = "這是一段測試文字，正常來說，你不應該看到它。",
}: {
  children: ReactNode;
  initialText?: string;
}) {
  const value = useTypingPractice(initialText);

  return <TypingContext.Provider value={value}>{children}</TypingContext.Provider>;
}

export function useTyping() {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error("useTyping must be used within TypingProvider / TypingModule");
  }
  return context;
}