'use server';  // 標記檔案為 Server Action

import { createServerSupabase } from '@/lib/supabase/server/server';

// 匯入 typing-sessions 函式
import {
  createTypingSession,
  createTypingDetails,
  getUserTypingSessions,
  getTypingSession,
  getTypingDetails,
} from '@/lib/db/typing-sessions';

// 因為 typing-sessions.ts 用 createServerSupabase，所以本身已是伺服器安全的
// 為了完整性，這裡重新包裝

export async function saveTypingSession(sessionData: any) {
  const session = await createTypingSession(sessionData);
  return session;
}

export async function saveTypingDetails(details: any[]) {
  const result = await createTypingDetails(details);
  return result;
}

export async function fetchUserSessions(userId: string, limit = 50, offset = 0) {
  const sessions = await getUserTypingSessions(userId, limit, offset);
  return sessions;
}

export async function fetchTypingSession(sessionId: string) {
  const session = await getTypingSession(sessionId);
  return session;
}

export async function fetchTypingDetails(sessionId: string) {
  const details = await getTypingDetails(sessionId);
  return details;
}