// components/typing/ResetButton.tsx
import { useTyping } from "./TypingProvider";

export default function ResetButton() {
  const { reset } = useTyping();

  return (
    <button
      onClick={reset}
      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mr-4"
    >
      重新開始
    </button>
  );
}