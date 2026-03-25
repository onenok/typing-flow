// components/typing/ResetButton.tsx
import Link from "next/link";
import { useTyping } from "./TypingProvider";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function TButtons() {
  const { user } = useAuth();
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
            {
              user ?
              <Link
                href="/results"
              >
                查看結果記錄
              </Link>
              :
              <Link
                href="/auth/login"
              >
                登入即查看結果記錄
              </Link>
            }
          </button>
          :
          ''
      }
    </div>
  );
}