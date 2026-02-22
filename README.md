# Typing Flow - 打字練習平台

一個功能強大的打字練習平台，幫助用戶提升打字速度和準確率。基於 Next.js 構建，使用 Supabase 作為後端。

## 功能特點

- ✅ 用戶認證系統（註冊/登入）
- ✅ 練習模式：自由練習各種文本
- ✅ 測驗模式：限時挑戰打字速度
- ✅ 歷史記錄：查看練習統計和詳細結果
- ✅ 個人資料管理
- ✅ 響應式設計，支持移動端
- ✅ 實時打字速度計算
- ✅ 準確率統計

## 技術棧

- **前端框架**: Next.js 16 (App Router)
- **UI 庫**: React 19
- **樣式**: Tailwind CSS
- **數據庫**: Supabase PostgreSQL
- **認證**: Supabase Auth
- **語言**: TypeScript

## 快速開始

### 前置條件

- Node.js 18+ 安裝
- Supabase 帳戶（免費）

### 1. 克隆項目

```bash
cd typing_flow
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 配置 Supabase

1. 前往 [Supabase](https://supabase.com) 創建新項目
2. 在項目設置中獲取：
   - Project URL
   - anon/public key

3. 複製 `.env.local` 並填入你的配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 設置數據庫

1. 前往 Supabase 控制台的 SQL Editor
2. 執行 `supabase/migrations/001_initial_schema.sql` 中的所有 SQL 語句
3. 這將創建必要的表和權限

### 5. 啟動開發服務器

```bash
npm run dev
```

打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 項目結構

```
typing_flow/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首頁
│   ├── components/        # 可复用組件
│   │   ├── Nav.tsx       # 導航欄
│   │   └── Footer.tsx    # 頁腳
│   ├── auth/             # 認證頁面
│   │   ├── login/
│   │   └── register/
│   ├── practice/         # 練習模式
│   ├── quiz/             # 測驗模式
│   ├── results/          # 結果頁面
│   └── profile/          # 個人資料
├── lib/                  # 工具庫
│   ├── supabase.ts      # Supabase 配置
│   ├── contexts/        # React Context
│   └── db/              # 數據庫操作
├── supabase/            # 數據庫遷移
│   └── migrations/
├── public/              # 靜態資源
├── docs/               # 文檔
│   ├── DEVELOPMENT_GUIDE.md
│   └── CODE_TEMPLATES.md
└── package.json
```

## 使用指南

### 首次使用

1. 點擊「立即註冊」創建帳戶
2. 登入後即可開始練習
3. 選擇練習模式或測驗模式
4. 完成練習後查看結果和統計

### 練習模式

- 輸入顯示的文本
- 實時查看速度和準確率
- 完成後可查看詳細分析

### 測驗模式

- 60秒限時挑戰
- 輸入盡可能多的字符
- 查看最終 WPM 和準確率

### 歷史記錄

- 查看所有練習記錄
- 統計平均速度和最佳成績
- 查看每次練習的詳細字符級分析

## 團隊開發

### 文檔

- [開發指南](docs/DEVELOPMENT_GUIDE.md) - 項目概述、核心概念、常見問題
- [代碼模板](docs/CODE_TEMPLATES.md) - 常用功能的複製粘貼模板

### 添加新功能

1. 閱讀開發指南了解項目結構
2. 參考代碼模板快速開始
3. 在 `app/` 目錄創建新頁面
4. 在 `Nav.tsx` 添加導航鏈接
5. 測試功能

### 常見任務

```bash
# 開發模式
npm run dev

# 構建生產版本
npm run build

# 啟動生產服務器
npm start

# 代碼檢查
npm run lint
```

## 配置說明

### 環境變量

| 變量名 | 說明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 項目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名 Key | ✅ |

### 數據庫表

- `users` - 用戶資料（擴展 auth.users）
- `typing_sessions` - 打字會話記錄
- `typing_details` - 詳細字符級記錄

## 部署

### Vercel（推薦）

1. 推送代碼到 GitHub
2. 在 Vercel 導入項目
3. 配置環境變量
4. 自動部署

### 其他平台

```bash
# 構建項目
npm run build

# 啟動生產服務器
npm start
```

## 故障排除

### 構建錯誤

```bash
# 清理並重新安裝
rm -rf node_modules package-lock.json
npm install
```

### 數據庫連接問題

- 檢查 `.env.local` 配置是否正確
- 確認 Supabase 項目處於活躍狀態
- 檢查 SQL 遷移是否已執行

### 頁面無法訪問

- 確認文件路徑正確：`app/[page-name]/page.tsx`
- 檢查是否添加 `"use client"` 指令（如需交互）
- 查看瀏覽器控制台錯誤信息

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 許可證

MIT License

## 資源

- [Next.js 文檔](https://nextjs.org/docs)
- [React 文檔](https://react.dev/)
- [Supabase 文檔](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 聯繫

如有問題，請創建 Issue 或聯繫維護團隊。