// src\app\terms-of-service\page.tsx
"use client";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="
        text-5xl font-bold text-gray-900 mb-6 text-center
        ">
          服務條款
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="
            bg-white rounded-lg shadow-md
            p-6 mb-8
            text-gray-700
          ">
            <h2 className="flex flex-col items-center text-gray-900 mb-6 text-4xl font-bold text-center">
              <span>歡迎使用 Typing Flow！</span>
              <span>以下是我們的服務條款，請仔細閱讀</span>
            </h2>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 服務使用</h2>
            <p className="text-gray-700 mb-6">
              使用 Typing Flow 服務即表示您同意遵守這些條款。您同意不會使用本服務從事任何非法或不當的行為。
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 帳戶安全</h2>
            <p className="text-gray-700 mb-6">
              您有責任保護您的帳戶資訊，並對您帳戶下的所有活動負責。如果您發現任何未經授權的使用，請立即聯繫我們。
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 內容所有權</h2>
            <p className="text-gray-700 mb-6">
              您在使用 Typing Flow 服務時創建的內容（如練習記錄、測驗結果等）將由您擁有，但您同意授予我們使用這些內容的權利，以提供和改進服務。
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 服務變更</h2>
            <p className="text-gray-700 mb-6">
              我們保留隨時修改或終止服務的權利，恕不另行通知。您同意我們對服務的任何修改或終止不承擔任何責任。
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 免責聲明</h2>
            <p className="text-gray-700 mb-6">
              本服務按「現狀」提供，我們不保證服務的準確性、可靠性或適用性。對於因使用或無法使用本服務而導致的任何損失，我們不承擔任何責任。
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 聯繫我們</h2>
            <p className="text-gray-700 mb-6">
              如果您對這些服務條款有任何疑問或需要進一步的資訊，請通過以下方式與我們聯繫：
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 *:max-sm:list-none">
              <li>聯繫我們：<Link href="/contact" className="text-blue-500 hover:underline">點擊這裡</Link></li>
              <li>電子郵件：s24214373@mail.sfu.edu.hk</li>
            </ul>
            <p className="text-gray-700">
              感謝您使用 Typing Flow，我們致力於提供優質的服務並保護您的權益。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}