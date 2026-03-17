// components/typingComponents/TypingModule.tsx
"use client";
import React, { ReactNode } from "react";
import { TypingProvider } from "./TypingProvider";
import TypingDisplay from "./TypingDisplay";
import HiddenInput from "./HiddenInput";
import TypingStats from "./TypingStats";
import ResetButton from "./ResetButton";

interface TypingModuleProps {
  children?: ReactNode;
  initialText?: string;
  title: string;
}

export default function TypingModule(
  {
    title = "",
    children,
    initialText = "這是一段測試文字，正常來說，你不應該看到它。",
  }: TypingModuleProps
) {
  return (
    <TypingProvider initialText={initialText}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <p className="text-gray-600 mb-4">{title}</p>

        {/* 預設區塊：如果使用者沒有自訂，就顯示這些 */}
        {!hasChild(children, "display") && <TypingDisplay />}
        {!hasChild(children, "input") && <HiddenInput />}
        {!hasChild(children, "stats") && <TypingStats />}
        {!hasChild(children, "reset") && (
          <div className="text-center">
            <ResetButton />
          </div>
        )}

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