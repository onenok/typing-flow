"use client";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-indigo-100">
            <main className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">隱私政策</h1>
                <p className="text-gray-700 mb-6">
                    我們非常重視您的隱私，以下是我們的隱私政策：
                </p>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 收集的資訊</h2>
                <p className="text-gray-700 mb-6">
                    我們可能會收集以下類型的資訊：
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6">
                    <li>個人資訊：如電子郵件地址、使用者名稱等，用於帳戶管理和提供服務。</li>
                    <li>使用資訊：如使用習慣、練習和測驗記錄等，用於改善服務體驗。</li>
                </ul>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 資訊的使用</h2>
                <p className="text-gray-700 mb-6">
                    我們收集的資訊將用於以下目的：
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6">
                    <li>提供和改善我們的服務。</li>
                    <li>個人化使用者體驗。</li>
                    <li>分析使用者行為以優化服務。</li>
                    <li>與使用者聯繫，包括回應查詢和提供重要通知。</li>
                </ul>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 資訊的保護</h2>
                <p className="text-gray-700 mb-6">
                    我們採取合理的技術和組織措施來保護您的資訊免受未經授權的訪問、使用或洩露。
                </p>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 資訊的分享</h2>
                <p className="text-gray-700 mb-6">
                    我們不會將您的個人資訊出售或出租給第三方，但可能會在以下情況下分享資訊：
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6">
                    <li>與服務提供商合作以提供和改善服務。</li>
                    <li>遵守法律法規或回應合法的政府要求。</li>
                    <li>保護我們的權利、財產或安全。</li>
                </ul>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 您的權利</h2>
                <p className="text-gray-700 mb-6">
                    您有權訪問、更正或刪除您的個人資訊，並且可以隨時選擇退出某些資訊的收集和使用。
                </p>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 聯繫我們</h2>
                <p className="text-gray-700 mb-6">
                    如果您對我們的隱私政策有任何疑問或擔憂，請通過以下方式與我們聯繫：
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6">
                    <li>電子郵件：privacy@typingflow.com</li>
                    <li>聯繫表單：<Link href="/contact" className="text-blue-500 hover:underline">點擊這裡</Link></li>
                </ul>
                <p className="text-gray-700">
                    感謝您使用 Typing Flow，我們致力於保護您的隱私並提供優質的服務。
                </p>
            </main>
        </div>
    );
};
