// components/typing/TypingDisplay.tsx
import { useTyping } from "./TypingProvider";

export default function TypingDisplay() {
  const { text, charIndex, errored } = useTyping();

  return (
    <div className="typing-text-container relative bg-gray-100 p-4 rounded-lg text-lg min-h-[3rem]">
      {text.split("").map((char, index) => (
        <pre
          key={index}
          className={`inline-block ${
            index < charIndex
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
  );
}