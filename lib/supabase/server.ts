import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export function publicDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
}
export function serviceDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
}
export async function sessionDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const jar = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) =>
            jar.set(name, value, options),
          );
        } catch {
          /* Cookies are refreshed by proxy for server components. */
        }
      },
    },
  });
}
export async function requireAdmin() {
  const db = await sessionDatabase();
  if (!db) throw new Error('Painel não configurado.');
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (error || !user?.email || !allowed.includes(user.email.toLowerCase()))
    throw new Error('Acesso não autorizado.');
  const { data, error: adminError } = await db
    .from('admins')
    .select('email')
    .eq('email', user.email.toLowerCase())
    .maybeSingle();
  if (adminError || !data) throw new Error('Acesso não autorizado.');
  return db;
}
