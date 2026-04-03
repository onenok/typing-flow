// src\app\components\typingComponents\TypingInput.tsx
import { useState, ReactNode } from "react";
import { useTyping } from "./TypingProvider";
import { getTextWidth } from "@/app/utils/getTextWidth"

// TODO: change this part that the current char will show as placeholder in the <input>
// and the <input> min-height will be thw width of the current char
// won't display the current char in the {inputPlaceholderHTML} part

export default function TypingInput() {
  const {
    TypingInputRef,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    text,              // 原文字
    displayText,       // 已輸入的顯示內容（包含錯字）
    charIndex,         // 當前應該輸入的位置
    //tMode,
    isComplete
  } = useTyping();
  const inputDefaultWidth = 0; //px
  const [inputWidth, setInputWidth] = useState(inputDefaultWidth);

  /*
  const typingDisplay = {
    typed: [],
    yet: [],
  }
  */

  const typedTextHTML = displayText
    .map(([displayChar, isCorrect], index) => {
      let typedTextClassName = "whitespace-pre-wrap inline-block text-lg";
      switch (isCorrect) {
        case 0: // 錯字（紅色 + 粗體）
          typedTextClassName += " bg-red-100 text-red-600 font-bold";
          break;
        case 1: // 已正確完成的字
          typedTextClassName += " text-green-600";
          break;
        case 2: // 錯誤了的字（黃色）
          typedTextClassName += " text-yellow-600";
          break;
        default:
          typedTextClassName += " text-gray-700";
      }
      return (
        <span key={index} className={typedTextClassName}>
          {displayChar}
        </span>
      );
    });

  const inputPlaceholderHTML: Iterable<ReactNode> = text
    .slice(charIndex + 1, text.length)
    .split('')
    .map((char, index) => {
      const inputPlaceholderClassName = "whitespace-pre-wrap inline-block text-lg text-gray-500";
      return (
        <span key={index + charIndex} className={inputPlaceholderClassName}>
          {char}
        </span>
      )
    });

  function changeInputWidth(e: React.CompositionEvent<HTMLInputElement>) {
    const newInputWidth = 2 + getTextWidth(e.data, "1.125rem", "font-mono w-fit inline text-lg font-mono", inputDefaultWidth);
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
        onMouseDown={() => {
          TypingInputRef.current?.focus();
        }}
      >
        {typedTextHTML/*typed words*/}
        <input
          ref={TypingInputRef}
          type={isComplete && charIndex >= text.length ? "hidden" : "text"}
          autoFocus
          style={{
            width: inputWidth,
            minWidth: 2 + getTextWidth(text[charIndex], "1.125rem", "font-mono w-fit inline text-lg font-mono", inputDefaultWidth)
          }}
          className={`whitespace-pre-wrap inline-block text-lg 
          ${!isComplete ? "bg-blue-200" : "bg-gray-200"}
          border-none text-black focus:outline-none px-px`}
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
          placeholder={text[charIndex]}
        />
        {inputPlaceholderHTML}
      </div>
    </div>
  );
}