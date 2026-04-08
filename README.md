# Typing Flow 打字練習平台

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Deployed on Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare-F38020?style=flat-square&logo=cloudflare)

一個功能完整的打字練習平台，幫助用戶通過系統化的練習提升打字速度和準確率。基於 Next.js 16 構建，使用 Supabase 作為後端，部署在 Cloudflare Workers。支持中文輸入法（倉頡、速成等）和繁體中文界面。

**[在線演示](#部署與訪問) • [功能特點](#功能特點) • [快速開始](#快速開始) • [開發指南](#團隊開發指南) • [故障排除](#故障排除)**

## 功能特點

### ✅ 核心功能

- **用戶認證系統**：註冊、登入、登出（Supabase Auth）
- **練習模式**：14+ 個難度遞進的關卡，從基礎到進階
- **測驗模式**：限時挑戰（60-120 秒），測試打字能力
- **實時統計**：
  - WPM（每分鐘字數）實時計算
  - 準確率動態更新
  - 完成度百分比 (Quiz only)
- **個人資料管理**：編輯顯示名稱、頭像、~~個人簽名~~
- **練習歷史**：查看所有練習記錄和詳細統計
- **輸入法支持**：原生支持中文（倉頡、速成等）輸入法組字
- **響應式設計**：完美適配桌面、平板、手機
- **自動保存**：所有練習數據自動保存到 Supabase

### ⚠️ 進行中/未來功能

- 用戶排行榜和社交功能
- 進度圖表和學習趨勢分析
- 自定義練習文本
- 暗黑模式支持
- 多語言界面支持

## 技術棧

### 核心依賴

| 技術 | 版本 | 用途 |
|------|------|------|
| Next.js | ^16.2.1 | 全棧 Web 框架 + App Router |
| React | 19.2.3 | UI 組件庫 |
| TypeScript | 5 | 類型安全的 JavaScript |
| Tailwind CSS | ^4.2.1 | 實用優先的樣式框架 |
| Supabase | ^2.98.0 | 後端 + 認證 + PostgreSQL 數據庫 |
| OpenNext | ^1.18.0 | Next.js 轉 Cloudflare Workers 適配器 |
| Sonner | ^2.0.7 | 精美的 Toast 通知 |
| OverlayScrollbars | ^2.14.0 | 自訂滾動條樣式 |

### 開發依賴

- ESLint 10 - 代碼質量檢查
- PostCSS 8 - CSS 轉換
- Wrangler 4.80.0 - Cloudflare Workers CLI

## 快速開始

### 前置條件

- **Node.js** 18 或更高版本
- **npm** 或 **yarn**
- **Supabase** 帳戶（[免費註冊](https://supabase.com)）
- **Git**

### 1️⃣ 克隆並進入項目

```bash
git clone https://github.com/onenok/typing-flow.git
cd typing_flow
```

### 2️⃣ 安裝依賴

```bash
npm install
```

### 3️⃣ 配置 Supabase

#### A. 在 Supabase 創建項目

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 點擊「New Project」創建新項目
3. 填入項目名稱、密碼、區域選擇
4. 等待項目初始化（約 1-2 分鐘）

#### B. 獲取項目憑證

1. 進入項目設置 (Settings → API)
2. 複製以下信息：
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (e.g., `eyJhbGc...`)

#### C. 配置環境變量

在項目根目錄建立 `.env.local` 文件：

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
```

### 4️⃣ 初始化數據庫

#### A. 執行 SQL 遷移

1. 在 Supabase Dashboard 進入 SQL Editor
2. 開啟新查詢 → 複製 `supabase/migrations/001_initial_schema.sql` 全部內容
3. 執行查詢，等待完成

**OR** 使用 Supabase CLI（推薦開發者）：

```bash
# 安裝 Supabase CLI（如未安裝）
npm install -g supabase

# 登入 Supabase
supabase login

# 執行遷移
supabase db push
```

#### B. 驗證數據庫

在 Supabase Dashboard 的 Table Editor 中確認以下表已創建：
- ✅ `profiles` - 用戶資料
- ✅ `typing_sessions` - 練習會話
- ✅ `typing_details` - 詳細記錄

### 5️⃣ 啟動開發服務器

```bash
npm run dev
```

打開瀏覽器訪問：[http://localhost:3000](http://localhost:3000)

你應該看到首頁，並能進行註冊/登入。

### ✨ 構建生產版本

```bash
npm run build
npm start
```

## 項目結構

```
typing_flow/
├── src/
│   ├── app/                          # Next.js App Router (主應用)
│   │   ├── layout.tsx               # 根布局 + 全局樣式
│   │   ├── page.tsx                 # 首頁/儀表板
│   │   ├── auth/                    # 認證頁面
│   │   │   ├── login/page.tsx       # 登入表單
│   │   │   └── register/page.tsx    # 註冊表單
│   │   ├── practice/                # 練習模式
│   │   │   ├── page.tsx             # 難度選擇
│   │   │   └── PracticeClient.tsx   # 練習邏輯
│   │   ├── quiz/                    # 測驗模式
│   │   │   ├── page.tsx             # 難度選擇
│   │   │   └── QuizClient.tsx       # 測驗邏輯
│   │   ├── results/                 # 結果頁面
│   │   │   ├── page.tsx             # 歷史列表
│   │   │   └── [id]/ResultDetailClient.tsx
│   │   ├── profile/page.tsx         # 個人資料編輯
│   │   ├── contact/page.tsx         # 聯繫頁面
│   │   ├── privacy-policy/page.tsx  # 隱私政策
│   │   ├── terms-of-service/page.tsx # 服務條款
│   │   ├── components/              # 可復用組件
│   │   │   ├── typingComponents/    # 打字練習組件
│   │   │   │   ├── TypingModule.tsx       # 主容器
│   │   │   │   ├── TypingProvider.tsx     # 狀態管理 (Context)
│   │   │   │   ├── TypingDisplay.tsx      # 文本顯示
│   │   │   │   ├── TypingInput.tsx        # 輸入框
│   │   │   │   ├── TypingStats.tsx        # 實時統計面板
│   │   │   │   ├── QuizTimer.tsx          # 測驗倒計時
│   │   │   │   ├── TypingButtons.tsx      # 操作按鈕
│   │   │   │   └── TypingSummary.tsx      # 成績總結
│   │   │   ├── Nav.tsx              # 導航欄
│   │   │   ├── Footer.tsx           # 頁腳
│   │   │   └── ui/                  # UI 基礎組件
│   │   ├── styles/                  # 全局和組件樣式
│   │   ├── typing/actions.ts        # Server Actions (API)
│   │   └── utils/                   # 工具函數
│   ├── lib/                         # 核心業務邏輯庫
│   │   ├── supabase/
│   │   │   ├── client.ts           # Supabase Client (前端)
│   │   │   └── server/server.ts    # Supabase Client (Server Action)
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx     # 認證狀態管理 Context
│   │   ├── db/
│   │   │   └── typing-sessions.ts  # 數據庫操作函數
│   │   ├── levels.ts               # 關卡配置數據
│   │   └── cangjie3.ts            # 倉頡字根庫
│   ├── hooks/
│   │   └── useTypingModule.ts      # 打字引擎核心邏輯 Hook
│   └── app/ (public 文件)
├── supabase/
│   └── migrations/                 # 數據庫遷移腳本
│       └── 001_initial_schema.sql
├── public/                         # 靜態資源
│   ├── manifest.json              # PWA 配置
│   └── _headers                   # Cloudflare headers
├── outdated_docs/                 # 舊文檔（已棄用）
├── wrangler.jsonc                 # Cloudflare Workers 配置
├── open-next.config.ts            # OpenNext 配置
├── next.config.ts                 # Next.js 配置
├── tsconfig.json                  # TypeScript 配置
├── tailwind.config.ts             # Tailwind CSS 配置
├── postcss.config.mjs             # PostCSS 配置
├── eslint.config.mjs              # ESLint 配置
├── package.json                   # 依賴管理和 npm scripts
└── README.md                      # 本文件
```

## 核心功能詳解

### 🎯 打字練習引擎

**核心邏輯**：`src/hooks/useTypingModule.ts`

#### 實時計算

- **WPM (Words Per Minute)**：
  ```
  WPM = (正確字符數) / (經過時間(s) / 60)
  ```

- **準確率**：
  ```
  準確率 = (正確字符數 / (正確 + 錯誤)) × 100%
  ```

- **完成進度**：
  ```
  進度 = (當前位置 / 總字符數) × 100%
  ```

#### 輸入法支持

使用 HTML5 Composition 事件支持實時輸入法組字：
- `compositionstart` - 用戶開始組字
- `compositionend` - 用戶完成組字
- 無卡頓地識別最終輸入字符

#### 誤字追蹤

記錄每個字符的正確性並用顏色區分：
- 🟢 **綠色** - 正確輸入
- 🔴 **紅色** - 完全錯誤
- 輸入欄專用:\
🟡 **黃色** - 錯誤了的文字

### 🔐 認證系統

**位置**：`src/lib/contexts/AuthContext.tsx`

#### 功能

1. **註冊** (`signUp`)
   - 郵箱 + 密碼註冊
   - 自動驗證 username（3-20 字符，支持小寫+數字+下劃線）
   - 創建 profiles 表記錄

2. **登入** (`signIn`)
   - 郵箱 + 密碼驗證
   - 自動加載用戶檔案

3. **登出** (`signOut`)
   - 清除本地狀態

4. **更新資料** (`updateProfile`)
   - 編輯顯示名稱、頭像 URL ~~、簽名~~

#### 超時保護

所有操作都有 5 秒超時保護，防止長期掛起

### 💾 數據庫模式

#### 表：`profiles` (用戶資料)

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | UUID | 主鍵（關聯 auth.users.id） |
| `display_name` | TEXT | 顯示名稱 |
| `username` | VARCHAR(20) | 唯一用戶名 |
| `avatar_url` | TEXT | 頭像 URL |
| `bio` | TEXT | 個人簽名 |
| `updated_at` | TIMESTAMPTZ | 更新時間 |

#### 表：`typing_sessions` (會話記錄)

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | UUID | 主鍵 |
| `user_id` | UUID | 外鍵→profiles.id |
| `mode` | VARCHAR | 'practice' 或 'quiz' |
| `text_type` | VARCHAR | 文本類型 |
| `duration_seconds` | INTEGER | 練習時長（秒） |
| `total_chars` | INTEGER | 總字符數 |
| `correct_chars` | INTEGER | 正確字符數 |
| `wpm` | DECIMAL | 每分鐘字數 |
| `accuracy` | DECIMAL | 準確率百分比 |
| `created_at` | TIMESTAMPTZ | 創建時間 |

#### 表：`typing_details` (詳細記錄，可選)

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | UUID | 主鍵 |
| `session_id` | UUID | 外鍵→typing_sessions.id |
| `char_index` | INTEGER | 字符位置 |
| `expected_char` | TEXT | 應輸入字符 |
| `typed_char` | TEXT | 實際輸入字符 |
| `is_correct` | BOOLEAN | 是否正確 |
| `time_ms` | INTEGER | 輸入耗時（毫秒） |
| `created_at` | TIMESTAMPTZ | 創建時間 |

**行級安全 (RLS)**：所有操作受 RLS 政策限制，用戶只能訪問自己的數據

### 📊 關卡系統

**配置文件**：`src/lib/levels.ts`

#### 練習關卡 (14+ 個)

| 難度 | 級別 | 說明 | 示例 |
|------|------|------|------|
| 🟢 Easy | 1-5 | 基礎字根和常用字 | 日月金木 |
| 🟡 Medium | 6-10 | 字根組合和短句 | 我你他她它 |
| 🔴 Hard | 11-14+ | 複雜字根和長句 | 完整句子 |

#### 測驗關卡 (分級)

- 各級別有對應的文本難度
- 時限範圍：60-120 秒
- 分數排名系統

### 🌐 部署與訪問

#### 開發環境

```bash
npm run dev  # http://localhost:3000
```

#### 生產環境 (Cloudflare Workers)

```bash
npm run build
npm run preview  # 本地預覽
npm run deploy   # 部署到 Cloudflare
```

**特色**：
- 🚀 全球 CDN 加速
- ⚡ 邊緣計算 (Edge Computing)
- 🔄 自動擴展
- 💰 按使用量計費

**訪問地址**：
```
https://typing-flow.yourworker.workers.dev
```

## 使用指南

### 首次使用

1. 訪問首頁 → 點擊「立即註冊」
2. 填入郵箱、密碼、用戶名
3. 驗證郵箱
4. 登入系統

### 練習模式

1. 選擇難度級別（簡單/中等/困難）
2. 根據顯示文本輸入
3. 實時查看 WPM、準確率、進度
4. 完成後查看成績

### 測驗模式

1. 選擇難度 + 級別
2. 倒計時開始（60 秒起）
3. 盡快輸入盡可能多字符
4. 時間結束自動提交，可查看結果

### 查看歷史

- **結果頁面**：查看所有練習記錄
- **個人資料**：編輯頭像~~和簽名~~

## 常見 NPM 命令

```bash
# 開發
npm run dev           # 啟動開發伺服器
npm run build         # 構建生產版本
npm start             # 啟動生產伺服器

# 質量檢查
npm run lint          # 運行 ESLint

# Cloudflare 部署
npm run preview       # 本地預覽 Cloudflare 環境
npm run deploy        # 部署到 Cloudflare Workers
npm run upload        # 推送靜態資源到 R2

# 類型檢查
npm run cf-typegen   # 生成 Cloudflare 環境類型
```

## 環境配置詳解

### `.env.local` 必需變量
Project Overview → Copy → Get Connected → Framework: nextjs, Variant: App Router → .env.local
| 變量 | 來源 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 項目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名 Key |

### 配置文件說明

| 文件 | 用途 |
|------|------|
| `next.config.ts` | Next.js 構建配置 |
| `tsconfig.json` | TypeScript 編譯選項 |
| `tailwind.config.ts` | Tailwind CSS 主題定制 |
| `postcss.config.mjs` | PostCSS 插件配置 |
| `wrangler.jsonc` | Cloudflare Workers 部署配置 |
| `open-next.config.ts` | OpenNext 適配器配置 |

## 故障排除

### ❌ 問題：npm install 失敗

```bash
# 解決方案
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### ❌ 問題：Supabase 連接失敗

**檢查項**：
- [ ] `.env.local` 文件存在並填入正確的 URL 和 Key
- [ ] Supabase 項目狀態是否為 Active
- [ ] 網絡連接是否正常

**調試**：
```bash
# 檢查環境變量是否加載
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### ❌ 問題：登入後頁面不跳轉

**原因**：
- AuthContext 未正確包裝應用
- 路由守衛配置問題

**解決**：
- 檢查 `layout.tsx` 是否包含 `<AuthProvider>`
- 查看瀏覽器控制台報錯信息

### ❌ 問題：輸入法組字失效

**檢查**：
- 使用的操作系統（Windows/Mac/Linux）
- 輸入法是否支持（倉頡、速成等）

### ❌ 問題：練習數據未保存

**檢查項**：
- [ ] Supabase 認證是否成功
- [ ] `typing_sessions` 表 RLS 政策是否正確
- [ ] 瀏覽器控制台是否有 API 報錯

**查看日誌**：
```typescript
// 在 src\app\hooks\useTypingModule.ts 添加日誌
console.log("Saving session:", sessionData);
```

## 團隊開發指南

### 創建新頁面

1. 在 `src/app/` 下新建目錄：`src/app/new-page/`
2. 創建 `page.tsx`：
   ```typescript
   export default function NewPage() {
     return <div>Your content</div>;
   }
   ```
3. 在 `Nav.tsx` 添加鏈接
如果鏈接列表個長而導致樣式出錯，請自行處理。

### 添加新組件

1. 在 `src/app/components/` 下創建文件
2. 遵循命名規則：`ComponentName.tsx`
3. 導出為默認導出或命名導出

### 修改樣式

使用 Tailwind CSS (**不要修改 CSS 文件**, 但可以創建新的css)：
```typescript
<div className="bg-blue-50 text-gray-700 rounded-lg p-4">
  Styled with Tailwind
</div>
```

### 添加數據庫操作

編輯 `src/lib/db/typing-sessions.ts`，遵循 RLS 安全原則

### 代碼風格

- 使用 TypeScript + 嚴格模式
- 組件使用 PascalCase
- 函數/變量使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 運行 `npm run lint` 檢查

## 貢獻指南

1. Fork 項目
2. 創建功能分支：`git checkout -b feature/my-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送到分支：`git push origin feature/my-feature`
5. 提交 Pull Request

## 已知限制

- ⚠️ 不支持暗黑模式
- ⚠️ 不支持多語言
- ⚠️ 無離線支持 (PWA)

## 下一步計劃

- ✨ 實現用戶排行榜
- ✨ 增加進度圖表和學習趨勢分析
- ✨ 構建自定義練習文本功能
- ✨ 集成分析追蹤

## 許可證

[MIT License](LICENSE)

## 資源和文檔

- [Next.js 官方文檔](https://nextjs.org/docs)
- [React 官方文檔](https://react.dev/)
- [Supabase 官方文檔](https://supabase.com/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/)

## 聯繫方式

- 📧 Email: [your-email@example.com](mailto:s24214373@mail.sfu.edu.hk)
- 🐙 GitHub Issues: [報告 Bug 或建議功能](https://github.com/onenok/typing-flow/issues)