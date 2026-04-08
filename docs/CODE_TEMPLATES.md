# Typing Flow 代碼模板

本文檔提供常用功能的代碼模板，團隊成員可以複製粘貼來快速添加新功能。

## 1. 新頁面模板

### 基本頁面（需要交互）
```tsx
// app/your-page/page.tsx
"use client";

import { useAuth } from "../../lib/contexts/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function YourPage() {
  const { user, loading } = useAuth();
  const [state, setState] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  // 檢查用戶登入狀態
  if (loading) {
    return <div>載入中...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>請先登入</p>
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            立即登入
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          頁面標題
        </h1>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* 頁面內容 */}
        </div>
      </main>
    </div>
  );
}
```

### 靜態頁面（不需要交互）
```tsx
// app/your-page/page.tsx
export default function YourPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          頁面標題
        </h1>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* 靜態內容 */}
        </div>
      </main>
    </div>
  );
}
```

## 2. 新組件模板

### 函數組件
```tsx
// app/components/YourComponent.tsx 或 lib/components/YourComponent.tsx
"use client";

import { useState } from "react";

interface YourComponentProps {
  title: string;
  onAction?: () => void;
}

export default function YourComponent({ title, onAction }: YourComponentProps) {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p>計數: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        增加
      </button>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 ml-2"
        >
          執行動作
        </button>
      )}
    </div>
  );
}
```

## 3. 表單處理模板

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function FormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 這裡替換為實際的 API 調用或數據庫操作
      const response = await fetch("/api/your-endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("提交失敗");
      }

      setSuccess(true);
      setFormData({ name: "", email: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">表單頁面</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            提交成功！
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">姓名</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">郵箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "提交中..." : "提交"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## 4. 數據庫操作模板

### 創建記錄
```tsx
import { createTypingSession } from "../lib/db/typing-sessions";

// 在組件中
const createRecord = async () => {
  const sessionData = {
    user_id: user.id,
    mode: "practice" as const,
    text_type: "sentences",
    text_content: "練習文本",
    duration_seconds: 30,
    total_chars: 100,
    correct_chars: 95,
    errors: 5,
    wpm: 60,
    accuracy: 95,
  };

  const newSession = await createTypingSession(sessionData);
  if (newSession) {
    console.log("創建成功:", newSession.id);
  } else {
    console.error("創建失敗");
  }
};
```

### 查詢記錄
```tsx
import { getUserTypingSessions, getTypingSession } from "../lib/db/typing-sessions";

// 獲取用戶所有記錄
const sessions = await getUserTypingSessions(user.id, 50, 0);

// 獲取單條記錄
const session = await getTypingSession(sessionId);
```

### 刪除記錄
```tsx
import { deleteTypingSession } from "../lib/db/typing-sessions";

const deleteRecord = async (sessionId: string) => {
  const success = await deleteTypingSession(sessionId, user.id);
  if (success) {
    console.log("刪除成功");
  } else {
    console.error("刪除失敗");
  }
};
```

## 5. 導航欄添加新鏈接

```tsx
// app/components/Nav.tsx
export default function Nav() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="site-nav">
      <div className="nav-list">
        <Link href="/" className="nav-item">首頁</Link>
        <Link href="/practice" className="nav-item">練習</Link>
        <Link href="/quiz" className="nav-item">測驗</Link>
        <Link href="/results" className="nav-item">結果</Link>
        {/* 添加新鏈接 */}
        <Link href="/your-page" className="nav-item">新頁面</Link>
      </div>

      <div className="nav-rightest">
        {user ? (
          <>
            <Link href="/profile" className="nav-item">
              {user.email}
            </Link>
            <button onClick={signOut} className="nav-item">登出</button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="nav-item">登入</Link>
            <Link href="/auth/register" className="nav-item">註冊</Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

## 6. 打字練習功能模板

```tsx
"use client";

import { useState, useEffect } from "react";

export default function TypingPractice() {
  const [text, setText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const sampleText = "你的練習文本...";

  useEffect(() => {
    setText(sampleText);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isComplete) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const expectedChar = text[charIndex];
    const typedChar = e.key;

    if (typedChar === expectedChar) {
      setCharIndex(prev => prev + 1);
      setTypedText(prev => prev + typedChar);
    } else if (typedChar.length === 1) {
      setErrors(prev => prev + 1);
    }

    if (charIndex + 1 >= text.length) {
      completeSession();
    }
  };

  const completeSession = () => {
    const duration = (Date.now() - (startTime || 0)) / 1000;
    const wpm = Math.round(((charIndex / 5) / (duration / 60)) * 10) / 10;
    const accuracy = Math.round(((charIndex - errors) / charIndex) * 100);

    console.log({ duration, wpm, accuracy });
    setIsComplete(true);
  };

  const resetPractice = () => {
    setTypedText("");
    setCharIndex(0);
    setErrors(0);
    setStartTime(null);
    setIsComplete(false);
  };

  return (
    <div>
      <div>練習文本：{text}</div>
      <div>已輸入：{typedText}</div>
      <div>速度：{startTime ? Math.round(((charIndex / 5) / ((Date.now() - startTime) / 60000)) * 100) / 100 : 0} WPM</div>
      <div>準確率：{startTime && charIndex > 0 ? Math.round(((charIndex - errors) / charIndex) * 100) : 0}%</div>
      <button onClick={resetPractice}>重新開始</button>
    </div>
  );
}
```

## 7. API 路由模板（如果需要）

```tsx
// app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 驗證用戶（可選）
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    // 執行數據庫操作
    const { data: result, error } = await supabase
      .from("your_table")
      .insert(data)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "伺服器錯誤" },
      { status: 500 }
    );
  }
}
```

## 8. 樣式類別參考

### 佈局
```tsx
<div className="min-h-screen">           // 最小高度為屏幕高度
<div className="container mx-auto">     // 居中容器
<div className="px-4 py-8">            // 內邊距
```

### 卡片
```tsx
<div className="bg-white rounded-lg shadow-lg p-8">
  {/* 內容 */}
</div>
```

### 按鈕
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
  按鈕
</button>

<button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition text-lg">
  大按鈕
</button>

<button disabled className="opacity-50 cursor-not-allowed">
  禁用狀態
</button>
```

### 網格佈局
```tsx
<div className="grid grid-cols-2 gap-4">           // 2列
<div className="grid grid-cols-3 gap-4">           // 3列
<div className="grid md:grid-cols-2 gap-8">        // 響應式：手機1列，平板2列
<div className="grid grid-cols-2 md:grid-cols-4 gap-4"> // 手機2列，桌面4列
```

### 文字
```tsx
<h1 className="text-3xl font-bold text-gray-900">           // 大標題
<h2 className="text-2xl font-semibold mb-4">               // 中標題
<p className="text-gray-600 mb-4">                         // 正文
<span className="text-sm text-gray-500">                  // 小字
```

### 表單
```tsx
<input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
<label className="block text-sm font-medium text-gray-700 mb-2">標籤</label>
```

### 狀態顏色
```tsx
bg-blue-50       // 淺藍背景
bg-green-50      // 淺綠背景
bg-red-50        // 淺紅背景
text-blue-600    // 藍色文字
text-green-600   // 綠色文字
text-red-600     // 紅色文字
```

## 9. 常見模式

### 載入狀態
```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>載入中...</p>
    </div>
  );
}
```

### 錯誤處理
```tsx
if (error) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      {error}
    </div>
  );
}
```

### 條件渲染
```tsx
{isComplete && (
  <div>
    完成！
  </div>
)}

{!user && (
  <Link href="/auth/login">登入</Link>
)}
```

## 使用說明

1. **找到需要的模板**
2. **複製代碼**
3. **替換標記為實際內容**（如頁面標題、API 端點等）
4. **調整樣式類別**以符合設計需求
5. **測試功能**

## 提示

- 所有頁面都需要 `"use client"`（如果需要 useState、useEffect）
- 導入路徑使用相對路徑，根據文件位置調整 `../` 或 `../../`
- `public` 文件夾的圖片使用 `/filename.svg` 絕對路徑
- 遇到問題時查看瀏覽器控制台（F12）和終端日誌