// src/app/typing/actions.ts
'use server';  // Mark file as Server Action

import { createServerSupabase } from '@/lib/supabase/server/server';

// Import typing-sessions functions
import {
  createTypingSession,
  createTypingDetails,
  getUserTypingSessions,
  getTypingSession,
  getTypingDetails,
} from '@/lib/db/typing-sessions';

// Since typing-sessions.ts uses createServerSupabase, it is already server-safe
// For completeness, rewrapped here

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