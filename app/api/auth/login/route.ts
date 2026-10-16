import { NextResponse } from 'next/server';
import { sessionDatabase } from '@/lib/supabase/server';
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const allowed = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase());
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !allowed.includes(email.toLowerCase())
    )
      return NextResponse.json(
        {
          error:
            'Não foi possível entrar. Confira suas credenciais e autorização.',
        },
        { status: 401 },
      );
    const db = await sessionDatabase();
    if (!db)
      return NextResponse.json(
        {
          error:
            'Configure o Supabase e os e-mails autorizados para ativar o painel.',
        },
        { status: 503 },
      );
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error)
      return NextResponse.json(
        {
          error:
            'Não foi possível entrar. Confira suas credenciais e autorização.',
        },
        { status: 401 },
      );
    const admin = await db
      .from('admins')
      .select('email')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (!admin.data) {
      await db.auth.signOut();
      return NextResponse.json(
        { error: 'Este acesso não está autorizado para o painel.' },
        { status: 403 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível entrar.' },
      { status: 400 },
    );
  }
}
