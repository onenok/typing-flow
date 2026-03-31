// src\app\components\typingComponents\TypingDisplay.tsx
import { useTyping } from "./TypingProvider";
import { getCangjie } from "@/lib/cangjie3";
interface TypingDisplayProps {
  titleN?: string;  // 可選
}

export default function TypingDisplay({ titleN = "" }: TypingDisplayProps) {
  const {
    text,
    charIndex,
    errored,
    isComplete,
  } = useTyping();
  const cjCodes = getCangjie(text[charIndex]);
  const currCjHTML = cjCodes.map((cjC, index) => {
    const CjChar = cjC.map((c, i) => {
      return (
        <div key={String(i) + "0"} className="flex flex-col">
          <span key={String(i) + "1"} className="text-gray-500 text-[24px] text-center">
            {c[0]}
          </span>
          <span key={String(i) + "2"} className="text-gray-500 text-[24px] text-center">
            {c[1]}
          </span>
        </div>
      )
    })
    return (
      <div key={index} className="text-gray-500 flex justify-center w-full">
        {CjChar}
      </div>
    )
  })
  
  return (
    <div>
      <p className="text-gray-600 mb-1">{titleN}</p>
      <div className="typing-text-container relative bg-gray-100 p-4 rounded-lg text-lg min-h-12">
        {text.split("").map((char, index) => (
          <pre
            key={index}
            className={`inline-block ${index < charIndex
              ? "text-green-500 bg-green-100"
              : errored && index === charIndex
                ? "text-red-500 bg-red-100"
                : "text-gray-700"
              }`}
          >
            {char}
          </pre>
        ))}
      </div>
      {/*for display current char and it's 倉頡碼*/}
      {!isComplete &&
        (
          <div className="text-gray-500 text-sm mt-2 bg-gray-100 p-2 rounded-lg">
            {/*for display current char*/}
            <h2 className="bg-blue-300 block w-fit place-self-center text-gray-500 text-[40px] text-center">
              <pre>{text[charIndex]}</pre>
            </h2>
            {/*for display 倉頡碼 of current char*/}
            <div className="text-gray-500 flex justify-center">
              {currCjHTML}
            </div>
          </div>
        )
      }
    </div>
  );
}