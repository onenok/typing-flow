import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// 客戶端專用（用在 Client Components、useEffect 等）
export function createClient() {
  // 只在瀏覽器執行，避免 build time 錯誤
  if (typeof window === 'undefined') {
    return null; // 或 throw new Error('createClient 只能在客戶端使用')
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  );
}