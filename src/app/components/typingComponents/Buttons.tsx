// components/typing/ResetButton.tsx
import Link from "next/link";
import { useTyping } from "./TypingProvider";

export default function TButtons() {
  const {
    reset,
    isComplete,
  } = useTyping();

  return (
    <div className="text-center">
      <button
        onClick={reset}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mr-4"
      >
        重新開始
      </button>
      {
        isComplete
          ?
          <button>
          <Link
          href="/results"
          >
            查看結果
          </Link>
          </button>
          :
          ''
      }
    </div>
  );
}