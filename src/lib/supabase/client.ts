// src\lib\supabase\client.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Client only (used in Client Components, useEffect, etc.)
export function createClient() {
  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  );
}