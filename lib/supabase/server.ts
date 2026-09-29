import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { env } from '@/lib/config/env';

export async function createServerSupabaseClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) throw new Error('Supabase environment variables are not configured.');
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
      }
    }
  });
}

export function createServiceClient() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) throw new Error('Supabase service role is not configured.');
  return createSupabaseClient(env.supabaseUrl, env.supabaseServiceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
