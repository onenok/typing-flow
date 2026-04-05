// src\app\components\typingComponents\TypingSummary.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTyping } from "./TypingProvider";
import { useAuth } from "@/lib/contexts/AuthContext";
import Link from "next/link";



interface TypingSummaryProps {
  onNextLevel?: () => void;
  onBackToLevels: () => void;
}

export default function TypingSummary({ onNextLevel, onBackToLevels }: TypingSummaryProps) {
  const { user, loading } = useAuth();
  const { wpm, accuracy, reset, isComplete, tMode } = useTyping();
  const [isShow, setIsShow] = useState(false);
  const [is100Opacity, setIs100Opacity] = useState(false);
  const endOverlayRef = useRef<HTMLDivElement>(null);
  const isCompleteRef = useRef(isComplete);

  useEffect(() => {
    if (isComplete) {
      setIsShow(true);
      setIs100Opacity(true);
      isCompleteRef.current = true;
    }
    else {
      setIsShow(false);
      isCompleteRef.current = false;
    }
  }, [isComplete]);

  useEffect(() => {
    endOverlayRef.current?.addEventListener('transitionend', (e) => {
      const currentIsComplete = isCompleteRef.current;
      console.log(
        'Transition ended:', e.propertyName,
        'isComplete:', currentIsComplete,
      );
      if (!currentIsComplete && e.propertyName === 'translate') {
        console.log('Hiding summary overlay after transition');
        setIs100Opacity(false);
      }
    });
  }, []);

  return (
    <div className={`
    fixed inset-0 z-50 flex items-center justify-center
    
    animate-in fade-in duration-2000
    ${!isShow ? 'pointer-events-none bg-none duration-200' : 'bg-black/50 backdrop-blur-sm duration-2000'}
    `}>
      <div className={`
        mx-4 w-full max-w-2xl
        rounded-3xl bg-white
        p-10 text-center shadow-2xl
        animate-in zoom-in transition-transform
        ${!isComplete && !is100Opacity ? 'opacity-0' : "opacity-100"}
        ${!isShow ? 'pointer-events-none translate-y-[100dvh] duration-200' : 'translate-y-0 duration-1000'}
        `}
        ref={endOverlayRef}
      >
        <h2 className="mb-8 text-4xl font-black text-gray-800">關卡完成！🎉</h2>

        <div className="mb-10 grid grid-cols-2 gap-6">
          <div className="rounded-2xl bg-blue-50 p-8 max-sm:p-3 shadow-sm">
            <div className="text-xs font-black uppercase tracking-widest text-blue-600">打字速度</div>
            <div className="mt-2 text-5xl max-sm:text-3xl font-black text-blue-900">
              {wpm} <span className="text-xl">WPM</span>
            </div>
          </div>
          <div className="rounded-2xl bg-green-50 p-8 max-sm:p-3 shadow-sm">
            <div className="text-xs font-black uppercase tracking-widest text-green-600">正確率</div>
            <div className="mt-2 text-5xl max-sm:text-3xl font-black text-green-900">
              {accuracy}%
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {onNextLevel && (
            <button
              onClick={() => {
                reset();
                onNextLevel();
              }}
              className="rounded-2xl bg-blue-600 px-10 py-4 text-lg font-black text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
              下一關
            </button>
          )}
          <button
            onClick={() => {
              reset();
              onBackToLevels();
            }}
            className="rounded-2xl border border-gray-200 bg-white px-10 py-4 text-lg font-black text-gray-600 transition-all hover:bg-gray-50"
          >
            返回關卡列表
          </button>
          <button
            onClick={reset}
            className="rounded-2xl border border-gray-200 bg-gray-50 px-10 py-4 text-lg font-black text-gray-500 transition-all hover:bg-gray-100"
          >
            重新{tMode?'練習':'測驗'}
          </button>
          {
            loading ? (
              <div className="inline-block bg-gray-200 text-gray-500 px-6 py-2 rounded-lg animate-pulse">
                加載中...
              </div>
            ) :
            user ?
              <Link
                href="/results"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                查看結果記錄
              </Link>
              :
              <Link
                href="/auth/login"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition animate-pulse"
              >
                登入帳戶即可記錄并查看結果
              </Link>
          }
        </div>

        <div className="mt-12 text-sm italic text-gray-400">
          "每一次練習，都是在通往倉頡大師的路上。"
        </div>
      </div>
    </div>
  );
}
