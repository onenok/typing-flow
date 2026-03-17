// components/typing/TypingStats.tsx
import { useTyping } from "./TypingProvider";

export default function TypingStats() {
  const { wpm, accuracy } = useTyping();

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-gray-600 text-sm">速度 (WPM)</p>
        <p className="text-2xl font-bold text-blue-600">{wpm}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <p className="text-gray-600 text-sm">準確率 (%)</p>
        <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
      </div>
    </div>
  );
}