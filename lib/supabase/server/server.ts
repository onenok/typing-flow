// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(c => ({
            name: c.name,
            value: c.value
          }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) => {
              // 只傳 name 和 value，忽略 options（Server Component 安全）
              cookieStore.set(name, value);
            });
          } catch {
            // 忽略錯誤（Server Component 無法 set cookie）
          }
        },
      },
    }
  );
}