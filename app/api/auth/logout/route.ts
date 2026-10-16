import { NextResponse } from 'next/server';
import { sessionDatabase } from '@/lib/supabase/server';
export async function POST() {
  const db = await sessionDatabase();
  await db?.auth.signOut();
  return NextResponse.json({ ok: true });
}
