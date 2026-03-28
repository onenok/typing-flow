// components/typing/TypingDisplay.tsx
import { useTyping } from "./TypingProvider";

interface TypingDisplayProps {
  titleN?: string;  // 可選
}

export default function TypingDisplay({ titleN = "" }: TypingDisplayProps) {
  const { text, charIndex, errored} = useTyping();

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
      <div className="text-gray-500 text-sm mt-2 bg-gray-100 p-2 rounded-lg">
      {/*for display current char*/}
        {charIndex < text.length && (
          <span className="block w-full text-gray-500 text-[24px] mt-2 text-center">
            {text[charIndex]}
          </span>
        )
        }
      {/*for display 倉頡碼 of current char*/}
        <div className="text-gray-500 mt-2">
          {charIndex < text.length && (
            <span className="text-gray-500 mt-2">

            </span>
          )}
        </div>
      </div>
    </div>
  );
}