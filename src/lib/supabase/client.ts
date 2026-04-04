// src\lib\supabase\client.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// 客戶端專用（用在 Client Components、useEffect 等）
export function createClient() {
  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  );
}