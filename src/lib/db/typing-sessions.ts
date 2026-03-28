import { createServerSupabase } from "../supabase/server/server";

export interface TypingSession {
  id: string;
  user_id: string;
  mode: "practice" | "quiz";
  text_type: string;
  text_content: string;
  duration_seconds: number | null;
  total_chars: number;
  correct_chars: number;
  errors: number;
  wpm: number;
  accuracy: number;
  created_at: string;
}

export interface TypingDetail {
  id: string;
  session_id: string;
  char_index: number;
  expected_char: string;
  typed_char: string;
  is_correct: boolean;
  time_ms: number;
  created_at: string;
}

export interface UserStats {
  total_sessions: number;
  total_practice_sessions: number;
  total_quiz_sessions: number;
  avg_wpm: number;
  avg_accuracy: number;
  best_wpm: number;
  total_chars_typed: number;
  total_correct_chars: number;
  first_session: string | null;
  last_session: string | null;
}

// 創建新的打字會話
export async function createTypingSession(session: {
  user_id: string;
  mode: "practice" | "quiz";
  text_type: string;
  text_content: string;
  duration_seconds: number | null;
  total_chars: number;
  correct_chars: number;
  errors: number;
  wpm: number;
  accuracy: number;
}): Promise<TypingSession | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("typing_sessions")
    .insert(session)
    .select()
    .single();

  if (error) {
    console.error("Error creating typing session:", error);
    return null;
  }

  return data;
}

// 創建打字詳細記錄
export async function createTypingDetails(
  details: {
    session_id: string;
    char_index: number;
    expected_char: string;
    typed_char: string;
    is_correct: boolean;
    time_ms: number;
  }[]
): Promise<TypingDetail[]> {
  if (details.length === 0) return [];
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("typing_details")
    .insert(details)
    .select();

  if (error) {
    console.error("Error creating typing details:", error);
    return [];
  }

  return data;
}


// 獲取用戶的所有打字會話
export async function getUserTypingSessions(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<TypingSession[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("typing_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching typing sessions:", error);
    return [];
  }

  return data || [];
}

// 獲取單個打字會話
export async function getTypingSession(
  sessionId: string
): Promise<TypingSession | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("typing_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    console.error("Error fetching typing session:", error);
    return null;
  }

  return data;
}

// 刪除打字會話
export async function deleteTypingSession(
  sessionId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("typing_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting typing session:", error);
    return false;
  }

  return true;
}
// 獲取會話的詳細記錄
export async function getTypingDetails(
  sessionId: string
): Promise<TypingDetail[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("typing_details")
    .select("*")
    .eq("session_id", sessionId)
    .order("char_index", { ascending: true });

  if (error) {
    console.error("Error fetching typing details:", error);
    return [];
  }

  return data || [];
}

// 獲取用戶統計數據
export async function getUserStats(userId: string): Promise<UserStats | null> {
  // 使用 RPC 調用存儲過程
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc("get_user_stats", {
    user_uuid: userId,
  });

  if (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }

  return data as UserStats;
}

// 獲取用戶的練習統計（按模式分組）
export async function getUserPracticeStats(
  userId: string
): Promise<{ mode: string; count: number; avg_wpm: number }[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("typing_sessions")
    .select("mode, wpm")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching practice stats:", error);
    return [];
  }

  // 按模式分組計算
  const stats = new Map<string, { count: number; totalWpm: number }>();

  data?.forEach((session) => {
    const existing = stats.get(session.mode) || { count: 0, totalWpm: 0 };
    stats.set(session.mode, {
      count: existing.count + 1,
      totalWpm: existing.totalWpm + session.wpm,
    });
  });

  return Array.from(stats.entries()).map(([mode, stats]) => ({
    mode,
    count: stats.count,
    avg_wpm: stats.totalWpm / stats.count,
  }));
}

// 更新用戶資料
export async function updateProfile(
  userId: string,
  fullName?: string,
  avatarUrl?: string
): Promise<{ error: any }> {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("users")
    .upsert({
      id: userId,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });
  return { error };
}
