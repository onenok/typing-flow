# Typing Flow 開發指南

## 項目概述
Typing Flow 是一個基於 Next.js 的打字練習平台，使用 Supabase 作為後端數據庫和認證系統。

## 技術棧
- **框架**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS
- **數據庫**: Supabase PostgreSQL
- **認證**: Supabase Auth
- **語言**: TypeScript

## 項目結構

```
app/
├── layout.tsx          # 根布局（包含 AuthProvider）
├── page.tsx            # 首頁
├── globals.css         # 全局樣式
├── components/         # 可复用組件
│   ├── Nav.tsx        # 導航欄
│   └── Footer.tsx     # 頁腳
├── auth/              # 認證頁面
│   ├── login/
│   │   └── page.tsx  # 登入頁面
│   └── register/
│       └── page.tsx  # 註冊頁面
├── practice/          # 練習模式頁面
├── quiz/              # 測驗模式頁面
├── results/           # 結果頁面
│   ├── page.tsx      # 結果列表
│   └── [id]/         # 結果詳情（動態路由）
└── profile/           # 個人資料頁面

lib/
├── supabase.ts        # Supabase 客戶端配置
├── contexts/
│   └── AuthContext.tsx  # 認證上下文（提供 useAuth）
└── db/
    └── typing-sessions.ts  # 數據庫操作函數

supabase/
└── migrations/
    └── 001_initial_schema.sql  # 數據庫結構
```

## 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 配置環境變量
複製 `.env.local` 並填入你的 Supabase 項目信息：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 運行數據庫遷移
在 Supabase 控制台執行 `supabase/migrations/001_initial_schema.sql` 中的 SQL 語句。

### 4. 啟動開發服務器
```bash
npm run dev
```
訪問 http://localhost:3000

## 核心概念

### 1. 頁面組件 (Page Components)
Next.js 使用文件系統路由。每個 `app/*/page.tsx` 文件都是一個頁面組件。

**示例：創建新頁面**
```tsx
// app/my-page/page.tsx
export default function MyPage() {
  return (
    <div>
      <h1>我的頁面</h1>
    </div>
  );
}
```

### 2. 客戶端組件 (Client Components)
需要交互（如 useState、useEffect）的頁面必須在文件頂部添加 `"use client"` 指令：

```tsx
"use client";

import { useState } from "react";

export default function MyPage() {
  const [count, setCount] = useState(0);
  // ...
}
```

### 3. 導航 (Navigation)
使用 Next.js 的 `Link` 組件進行客戶端導航（無刷新）：

```tsx
import Link from "next/link";

<Link href="/practice">開始練習</Link>
```

### 4. 認證系統 (Authentication)
使用 `useAuth()` 鉤子訪問認證狀態：

```tsx
import { useAuth } from "../lib/contexts/AuthContext";

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>載入中...</div>;
  
  if (user) {
    return <button onClick={signOut}>登出</button>;
  } else {
    return <button onClick={() => signIn(email, password)}>登入</button>;
  }
}
```

### 5. 數據庫操作
從 `lib/db/typing-sessions.ts` 導入函數：

```tsx
import { createTypingSession, getUserTypingSessions } from "../lib/db/typing-sessions";

// 創建會話
const session = await createTypingSession({
  user_id: user.id,
  mode: "practice",
  text_type: "sentences",
  text_content: "練習文本",
  duration_seconds: 30,
  total_chars: 100,
  correct_chars: 95,
  errors: 5,
  wpm: 60,
  accuracy: 95,
});

// 獲取會話列表
const sessions = await getUserTypingSessions(user.id, 50, 0);
```

## 常用任務

### 添加新頁面
1. 在 `app/` 目錄下創建新文件夾（如 `app/settings/`）
2. 創建 `page.tsx`
3. 如果需要，創建組件放在 `app/components/` 或 `lib/components/`
4. 在 `app/components/Nav.tsx` 添加導航鏈接

### 添加新組件
1. 創建 `app/components/MyComponent.tsx` 或 `lib/components/MyComponent.tsx`
2. 導入時使用相對路徑：
   - 從 `app/page.tsx` 導入：`import MyComponent from "./components/MyComponent"`
   - 從 `app/auth/login/page.tsx` 導入：`import MyComponent from "../../components/MyComponent"`

### 添加新的數據庫表
1. 在 `supabase/migrations/` 創建新遷移文件
2. 在 `lib/db/` 創建新的 TypeScript 文件或添加到 `typing-sessions.ts`
3. 定義 TypeScript 接口
4. 實現 CRUD 函數

### 處理表單提交
```tsx
"use client";

import { useState } from "react";

export default function MyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // 執行操作...
    
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 表單字段 */}
      <button type="submit" disabled={loading}>
        {loading ? "提交中..." : "提交"}
      </button>
    </form>
  );
}
```

## 樣式指南

### 使用 Tailwind CSS
項目已配置 Tailwind CSS，直接在 JSX 中使用工具類：

```tsx
<div className="bg-white p-4 rounded-lg shadow-lg">
  <h1 className="text-3xl font-bold text-gray-900">標題</h1>
  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    按鈕
  </button>
</div>
```

### 自定義樣式
全局樣式在 `app/styles/App.css` 中定義，如：
- `.site-nav` - 導航欄樣式
- `.site-footer` - 頁腳樣式
- `.nav-item` - 導航鏈接樣式

## 常見問題

### Q: 為什麼我的組件找不到模塊？
A: 檢查導入路徑。Next.js 使用相對路徑：
- `app/page.tsx` 導入 `components/Nav.tsx` → `import Nav from "./components/Nav"`
- `app/auth/login/page.tsx` 導入 `AuthContext` → `import { useAuth } from "../../lib/contexts/AuthContext"`

### Q: 如何使用 public 文件夾的圖片？
A: `public` 文件夾的資源通過絕對路徑訪問：
```tsx
<img src="/react.svg" alt="React Logo" />
```

### Q: 頁面不刷新，如何看到更改？
A: Next.js 開發服務器支援熱重載，保存文件後會自動刷新。如果沒有，手動刷新瀏覽器。

### Q: 如何調試？
A: 使用 `console.log()` 輸出到瀏覽器控制台。Next.js 開發服務器的日誌會顯示在終端。

### Q: 如何部署？
A: 
1. 構建項目：`npm run build`
2. 啟動生產服務器：`npm start`
3. 或部署到 Vercel（推薦，與 Next.js 深度集成）

## 代碼規範

### 命名規範
- 文件：小寫 + 連字符（`typing-sessions.ts`）
- 組件：大寫駝峰（`Nav.tsx`, `Footer.tsx`）
- 函數：小寫駝峰（`createTypingSession`）
- 常量：大寫蛇形（`MAX_RETRIES`）

### TypeScript 類型
- 為所有函數參數和返回值定義接口
- 使用 `any` 作為最後手段
- 可選屬性使用 `?`：`interface User { name?: string }`

### 錯誤處理
- 數據庫操作總是檢查 `error` 對象
- 使用 `console.error` 記錄錯誤
- 向用戶顯示友好的錯誤消息

## 下一步

1. **自定義樣式**：修改 `app/styles/App.css` 和 Tailwind 配置
2. **添加功能**：參考現有頁面模式添加新功能
3. **優化性能**：使用 React.memo、useMemo、useCallback
4. **測試**：手動測試所有流程，添加單元測試（可選）

## 資源
- [Next.js 官方文檔](https://nextjs.org/docs)
- [React 官方文檔](https://react.dev/)
- [Supabase 文檔](https://supabase.com/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)