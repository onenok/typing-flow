-- 創建打字練習平台的數據庫模式

-- 1. 擴展 auth.users 表（如果需要額外字段）
-- 注意：auth.users 是 Supabase Auth 內置表，我們可以創建一個關聯的 public.users 表

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 創建 RLS 策略
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 用戶可以查看和更新自己的信息
CREATE POLICY "Users can view own user data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own user data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 2. 打字會話表
CREATE TABLE IF NOT EXISTS public.typing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'quiz')),
  text_type TEXT NOT NULL, -- 'words', 'sentences', 'code', 'custom'
  text_content TEXT NOT NULL, -- 練習的文本內容
  duration_seconds INTEGER, -- 持續時間（秒），NULL表示自由練習直到完成
  total_chars INTEGER NOT NULL, -- 總字符數
  correct_chars INTEGER NOT NULL, -- 正確字符數
  errors INTEGER NOT NULL DEFAULT 0,
  wpm REAL NOT NULL, -- 每分鐘單詞數
  accuracy REAL NOT NULL, -- 準確率百分比
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 創建 RLS 策略
ALTER TABLE public.typing_sessions ENABLE ROW LEVEL SECURITY;

-- 用戶可以查看自己的會話記錄
CREATE POLICY "Users can view own typing sessions" ON public.typing_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- 用戶可以創建自己的會話記錄
CREATE POLICY "Users can insert own typing sessions" ON public.typing_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用戶可以刪除自己的會話記錄
CREATE POLICY "Users can delete own typing sessions" ON public.typing_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- 3. 打字詳細記錄表（可選，用於更詳細的分析）
CREATE TABLE IF NOT EXISTS public.typing_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.typing_sessions(id) ON DELETE CASCADE,
  char_index INTEGER NOT NULL, -- 字符在文本中的位置
  expected_char TEXT NOT NULL, -- 期望的字符
  typed_char TEXT NOT NULL, -- 實際輸入的字符
  is_correct BOOLEAN NOT NULL, -- 是否正確
  time_ms INTEGER NOT NULL, -- 擊鍵時間（毫秒，相對於會話開始）
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 創建 RLS 策略
ALTER TABLE public.typing_details ENABLE ROW LEVEL SECURITY;

-- 用戶可以查看自己會話的詳細記錄
CREATE POLICY "Users can view own typing details" ON public.typing_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.typing_sessions
      WHERE typing_sessions.id = typing_details.session_id
      AND typing_sessions.user_id = auth.uid()
    )
  );

-- 用戶可以插入自己會話的詳細記錄
CREATE POLICY "Users can insert own typing details" ON public.typing_details
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.typing_sessions
      WHERE typing_sessions.id = typing_details.session_id
      AND typing_sessions.user_id = auth.uid()
    )
  );

-- 4. 創建索引以提高查詢性能
CREATE INDEX IF NOT EXISTS idx_typing_sessions_user_id ON public.typing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_sessions_created_at ON public.typing_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_typing_details_session_id ON public.typing_details(session_id);

-- 5. 創建存儲過程/函數（可選）
-- 獲取用戶統計數據
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_sessions', COUNT(*),
    'total_practice_sessions', COUNT(*) FILTER (WHERE mode = 'practice'),
    'total_quiz_sessions', COUNT(*) FILTER (WHERE mode = 'quiz'),
    'avg_wpm', ROUND(AVG(wpm), 2),
    'avg_accuracy', ROUND(AVG(accuracy), 2),
    'best_wpm', MAX(wpm),
    'total_chars_typed', SUM(total_chars),
    'total_correct_chars', SUM(correct_chars),
    'first_session', MIN(created_at),
    'last_session', MAX(created_at)
  ) INTO stats
  FROM public.typing_sessions
  WHERE user_id = user_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 創建觸發器來自動更新 updated_at 字段
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();