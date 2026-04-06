"use client";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
          聯繫我們
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-gray-700">
            <h2 className="text-gray-900 mb-4 text-3xl font-bold text-center">
              我們很樂意為您提供協助
            </h2>
            <p className="text-gray-700 mb-6">
              若您在使用 Typing Flow 時遇到問題，或想建議新功能，請透過以下方式聯絡我們。
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>
                GitHub Issues：
                <a
                  href="https://github.com/onenok/typing_platform/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  報告問題 / 建議功能
                </a>
              </li>
              <li>
                電子郵件：
                <a
                  href="mailto:s24214373@mail.sfu.edu.hk"
                  className="text-blue-500 hover:underline"
                >
                  s24214373@mail.sfu.edu.hk
                </a>
              </li>
            </ul>

            <p className="text-gray-700">
              我們會在最短時間內回覆您的訊息。感謝您使用 Typing Flow！
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}