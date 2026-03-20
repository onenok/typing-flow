"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useState } from "react";
import TypingModule from "@/app/components/typingComponents/TypingModule";
import Link from "next/link";

export default function PracticePage() {
  const { user, loading } = useAuth();
  const sampleText = `這是一段測試文字...`;

  if (loading) {
    return (
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            載入中... loading: {loading ? "true" : "false"} user: {user ? user.id : "null"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          練習模式
        </h1>
        <TypingModule title="練習文本" initialText={sampleText} />
      </main>
    </div>
  );
}