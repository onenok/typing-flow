// components/typing/TypingInput.tsx
import { useState, ReactNode } from "react";
import { useTyping } from "./TypingProvider";
import { getTextWidth } from "@/app/utils/getTextWidth"

export default function TypingInput() {
  const {
    TypingInputRef,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    text,              // 原文字
    displayText,       // 已輸入的顯示內容（包含錯字）
    charIndex,         // 當前應該輸入的位置
    displayIndex,         //
    errored,           // 是否剛打錯
    isComplete
  } = useTyping();
  const inputDefaultWidth = 1; //px
  const [inputWidth, setInputWidth] = useState(inputDefaultWidth);

  /*
  const typingDisplay = {
    typed: [],
    yet: [],
  }
  */

  const typedTextHTML = displayText
    .map(([displayChar, isCorrect], index) => {
      let typedTextClassName = "inline-block text-lg";

      if (isCorrect) {
        typedTextClassName += " text-green-600"; // 已正確完成的字
        return (
          <pre key={index} className={typedTextClassName}>
            {displayChar}
          </pre>
        );
      }
      else {
        typedTextClassName += " bg-red-100 text-red-600 font-bold"; // 錯字（紅色 + 粗體）
        return (
          <pre key={index} className={typedTextClassName}>
            {displayChar}
          </pre>
        );
      }
    });

  const inputPlaceholderHTML: Iterable<ReactNode> = text
    .slice(charIndex, text.length)
    .split('')
    .map((char, index) => {
      const inputPlaceholderClassName = "inline-block text-lg text-gray-500";
      return (
        <pre key={index + charIndex} className={inputPlaceholderClassName}>
          {char}
        </pre>
      )
    });

  function changeInputWidth(e: React.CompositionEvent<HTMLInputElement>) {
    const newInputWidth = getTextWidth(e.data, "1.125rem", "font-mono w-fit inline text-lg font-mono", inputDefaultWidth);
    console.log(e.data, newInputWidth);
    setInputWidth(newInputWidth);
  }

  function setDefaultInputWidth() {
    setInputWidth(inputDefaultWidth);
  }
  return (
    <div className="mt-6">
      <p className="text-gray-600 mb-2 text-sm">
        輸入框（點擊這裡開始輸入，支援輸入法）
      </p>

      {/* 輸入歷程顯示區（在輸入框上方，類似真實打字機效果） */}
      <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-12 text-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        onClick={() => {
          TypingInputRef.current?.focus();
        }}
      >
        {typedTextHTML/*typed words*/}
        <input
          ref={TypingInputRef}
          type="text"
          autoFocus
          style={{ width: inputWidth }}
          className="inline bg-none border-none text-lg font-mono
                   text-black focus:outline-none"
          onCompositionUpdate={changeInputWidth}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={
            (e) => {
              handleCompositionEnd(e);
              setDefaultInputWidth();
            }
          }
          onInput={handleInput}
          autoComplete="off"
          spellCheck={false}
          disabled={isComplete}
        />
        {inputPlaceholderHTML}
      </div>
    </div>
  );
}