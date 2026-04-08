// src\app\components\typingComponents\TypingModule.tsx
"use client";
import React, { ReactNode } from "react";
import { TypingProvider } from "./TypingProvider";
import TypingDisplay from "./TypingDisplay";
import TypingInput from "./TypingInput";
import TypingStats from "./TypingStats";
import TypingButtons from "./TypingButtons";
import TypingSummary from "./TypingSummary";
import QuizTimer from "./QuizTimer";

interface TypingModuleProps {
  children?: ReactNode;
  initialText?: string;
  title: string;
  tMode: "practice" | "quiz";
  timeoutS?: number;
  onNextLevel?: () => void;
  onBackToLevels?: () => void;
}

export default function TypingModule(
  {
    title = "",
    children,
    initialText = "這是一段測試文字，正常來說，你不應該看到它。",
    tMode,
    timeoutS = 60,
    onNextLevel,
    onBackToLevels = () => {},
  }: TypingModuleProps
) {
  return (
    <TypingProvider initialText={initialText} tMode={tMode} timeoutS={timeoutS}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 gap-4 grid">
        {/* Default block: display these if user doesn't customize */}
        {!hasChild(children, "timer") && tMode === "quiz" && <QuizTimer />}
        {!hasChild(children, "display") && <TypingDisplay titleN={title} />}
        {!hasChild(children, "input") && <TypingInput />}
        {!hasChild(children, "stats") && <TypingStats />}
        {!hasChild(children, "reset") && <TypingButtons />}
        {!hasChild(children, "summary") && <TypingSummary onNextLevel={onNextLevel} onBackToLevels={onBackToLevels} />}
        {/* User custom content */}
        {children}
      </div>
    </TypingProvider>
  );
}

// Helper function: check if children has specific marker
function hasChild(children: ReactNode, type: string): boolean {
  if (!children) return false;

  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    const props = child.props as {
      "data-typing"?: string;
      [key: string]: unknown;  // Allow other attributes
    };;

    return (
      props["data-typing"] === type
    );
  });
}