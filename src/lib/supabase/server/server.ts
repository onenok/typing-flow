// src\lib\supabase\server\server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
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
              // Only pass name and value, ignore options (Server Component safe)
              cookieStore.set(name, value);
            });
          } catch {
            // Ignore errors (Server Component cannot set cookie)
          }
        },
      },
    }
  );
}