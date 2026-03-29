// src\app\components\typingComponents\TypingModule.tsx
"use client";
import React, { ReactNode } from "react";
import { TypingProvider } from "./TypingProvider";
import TypingDisplay from "./TypingDisplay";
import TypingInput from "./TypingInput";
import TypingStats from "./TypingStats";
import TButtons from "./Buttons";
import "./typingStyle.css";

interface TypingModuleProps {
  children?: ReactNode;
  initialText?: string;
  title: string;
  tMode: "practice" | "quiz";
  timeoutS?: number;
}

export default function TypingModule(
  {
    title = "",
    children,
    initialText = "這是一段測試文字，正常來說，你不應該看到它。",
    tMode,
    timeoutS = 60
  }: TypingModuleProps
) {
  return (
    <TypingProvider initialText={initialText} tMode={tMode} timeoutS={timeoutS}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 gap-4 grid">
        {/* 預設區塊：如果使用者沒有自訂，就顯示這些 */}
        {!hasChild(children, "display") && <TypingDisplay titleN={title} />}
        {!hasChild(children, "input") && <TypingInput />}
        {!hasChild(children, "stats") && <TypingStats />}
        {!hasChild(children, "reset") && <TButtons />}

        {/* 使用者自訂內容 */}
        {children}
      </div>
    </TypingProvider>
  );
}

// 輔助函數：檢查 children 是否有特定標記
function hasChild(children: ReactNode, type: string): boolean {
  if (!children) return false;

  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    const props = child.props as {
      "data-typing"?: string;
      [key: string]: unknown;  // 允許其他屬性
    };;

    return (
      props["data-typing"] === type
    );
  });
}