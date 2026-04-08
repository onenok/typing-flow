// src\lib\db\typing-sessions.ts
import { createServerSupabase } from "@/lib/supabase/server/server";

export interface TypingSession {
  id: string;
  user_id: string;
  mode: "practice" | "quiz";
  text_type: string;
  text_content: string;
  duration_seconds: number | null;
  total_chars: number;
  typed_chars: number;
  correct_chars: number;
  errors: number;
  wpm: number;
  accuracy: number;
  completion_rate: number; // only for quiz mode
  created_at: string;
}

export interface TypingDetail {
  id: string;
  session_id: string;
  char_index: number;
  expected_char: string;
  isTyped: boolean;
  wrong_types: string;
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

// ==================== helper function(s) ====================
const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number = 5000 // 5s
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`請求超時(超過 ${timeoutMs / 1000} 秒)，請嘗試重新加載頁面或稍後再試。`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};

// ==================== Write functions（must throw error） ====================

// create a new typing session
export async function createTypingSession(session: {
  user_id: string;
  mode: "practice" | "quiz";
  text_type: string;
  text_content: string;
  duration_seconds: number | null;
  total_chars: number;
  typed_chars: number;
  correct_chars: number;
  errors?: number;
  wpm: number;
  accuracy: number;
  completion_rate: number; // only for quiz mode
}): Promise<TypingSession> {
  const createTypingSessionPromise = async () => {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("typing_sessions")
      .insert(session)
      .select()
      .single();

    if (error) {
      let message = "儲存打字記錄失敗";

      if (error.code === "23503") {
        message = "找不到對應的用戶資料，請確認已登入";
      } else if (error.code === "23505") {
        message = "資料重複，請稍後再試";
      } else if (error.message) {
        message = error.message;
      }

      throw new Error(message + error);
    }

    if (!data) {
      throw new Error("儲存失敗：未返回資料");
    }

    return data;
  }
  return withTimeout(createTypingSessionPromise(), 5000);
}

// create typing details for a session (multiple records at once)
export async function createTypingDetails(
  details: {
    session_id: string;
    char_index: number;
    expected_char: string;
    isTyped: boolean;
    wrong_types: string;
    is_correct: boolean;
    time_ms: number;
  }[]
): Promise<TypingDetail[]> {
  const createTypingDetailsPromise = async () => {
    if (details.length === 0) return [];

    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("typing_details")
      .insert(details)
      .select();

    if (error) {
      let message = "儲存細節記錄失敗";

      if (error.code === "23503") {
        message = "找不到對應的打字會話，請確認 session_id 正確";
      }

      throw new Error(message + JSON.stringify(error));
    }

    return data || [];
  }
  return withTimeout(createTypingDetailsPromise(), 5000);
}

// delete a typing session and its details (used for allowing users to delete their records)
export async function deleteTypingSession(
  sessionId: string,
  userId: string
): Promise<boolean> {
  const deleteTypingSessionPromise = async () => {
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("typing_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (error) {
      let message = "刪除打字記錄失敗";

      if (error.code === "23503") {
        message = "權限不足或記錄不存在";
      }

      throw new Error(message);
    }

    return true;
  }
  return withTimeout(deleteTypingSessionPromise(), 5000);
}

// ==================== Query functions ====================

// get recent typing sessions for a user, with pagination support
export async function getUserTypingSessions(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<TypingSession[]> {
  const getUserTypingSessionsPromise = async () => {
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
  return withTimeout(getUserTypingSessionsPromise(), 5000);
}

// get a specific typing session by id (used for results page)
export async function getTypingSession(
  sessionId: string
): Promise<TypingSession | null> {
  const getTypingSessionPromise = async () => {
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
  return withTimeout(getTypingSessionPromise(), 5000);
}

// get typing details for a session
export async function getTypingDetails(
  sessionId: string
): Promise<TypingDetail[]> {
  const getTypingDetailsPromise = async () => {
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
  return withTimeout(getTypingDetailsPromise(), 5000);
}

// ==================== Unused functions (might be useful in the future) ====================

// unused for now, but might be useful in the future for showing overall user stats
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const getUserStatsPromise = async () => {
  // comment placeholder
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
  return withTimeout(getUserStatsPromise(), 5000);
}

// unused for now, but might be useful in the future for showing stats by mode
export async function getUserPracticeStats(
  userId: string
): Promise<{ mode: string; count: number; avg_wpm: number }[]> {
  const getUserPracticeStatsPromise = async () => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("typing_sessions")
    .select("mode, wpm")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching practice stats:", error);
    return [];
  }

  // comment placeholder
  const stats = new Map<string, { count: number; totalWpm: number }>();

  data?.forEach((session: any) => {
    const existing = stats.get(session.mode) || { count: 0, totalWpm: 0 };
    stats.set(session.mode, {
      count: existing.count + 1,
      totalWpm: existing.totalWpm + session.wpm,
    });
  });

  return Array.from(stats.entries()).map(([mode, s]) => ({
    mode,
    count: s.count,
    avg_wpm: s.totalWpm / s.count,
  }));
  }
  return withTimeout(getUserPracticeStatsPromise(), 5000);
}