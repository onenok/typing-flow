// components/typing/TypingInput.tsx
import { useState } from "react";
import { useTyping } from "./TypingProvider";
import { getTextWidth } from "@/app/hooks/getTextWidth"

export default function TypingInput() {
  const {
    TypingInputRef,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    text,              // 原文字
    displayText,       // 已輸入的顯示內容（包含錯字）
    charIndex,         // 當前應該輸入的位置
    errored,           // 是否剛打錯
    isComplete
  } = useTyping();
  const [inputWidth, setInputWidth] = useState(1);

  let inputPlaceholder = "";
  const typedTextHTML = text.split("").map((originalChar, index) => {
    const displayed = displayText[index];

    let className = "inline-block text-lg";

    if (index < charIndex) {
      className += " text-green-600"; // 已正確完成的字
      return (
        <span key={index} className={className}>
          {displayed || originalChar}
        </span>
      );
    } else if (displayed && displayed !== originalChar) {
      className += " bg-red-100 text-red-600 font-bold"; // 錯字（紅色 + 粗體）
      inputPlaceholder += originalChar;
      return (
        <span key={index} className={className}>
          {displayed || originalChar}
        </span>
      );
    }
    else {
      inputPlaceholder += displayed || originalChar; // 未輸入的部分
    }
  })
  function changeInputWidth(e: React.CompositionEvent<HTMLInputElement>) {
    setInputWidth(getTextWidth(e.data, "1.125rem", "font-mono w-fit inline text-lg font-mono"));
    console.log(e.data, inputWidth)
  }
  function setDefaultInputWidth(){
    setInputWidth(1);
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
          onCompositionEnd={(e)=>{handleCompositionEnd(e);setDefaultInputWidth()}}
          onInput={handleInput}
          autoComplete="off"
          spellCheck={false}
          disabled={!isComplete}
        />
        <span className="text-gray-500">{inputPlaceholder}</span>
      </div>
    </div>
  );
}