import { NextResponse, after } from 'next/server';
import { leadSchema, prioridadeLead } from '@/lib/lead';
import { serviceDatabase } from '@/lib/supabase/server';
import { allowLead } from '@/lib/rate-limit';
export async function POST(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 10000)
    return NextResponse.json(
      { error: 'Solicitação muito grande.' },
      { status: 413 },
    );
  let payload;
  try {
    const text = await request.text();
    if (text.length > 10000)
      return NextResponse.json(
        { error: 'Solicitação muito grande.' },
        { status: 413 },
      );
    payload = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: 'Solicitação inválida.' },
      { status: 400 },
    );
  }
  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Confira os campos e o consentimento antes de enviar.' },
      { status: 400 },
    );
  try {
    const ip = process.env.VERCEL
      ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
        'unknown'
      : 'local';
    if (!(await allowLead(ip)))
      return NextResponse.json(
        {
          error:
            'Limite de envios atingido. Tente mais tarde ou fale pelo WhatsApp.',
        },
        { status: 429 },
      );
    const db = serviceDatabase();
    if (!db) return NextResponse.json({ ok: true, saved: false });
    const { website: honeypot, ...lead } = parsed.data;
    void honeypot;
    const priority = prioridadeLead(lead);
    const { error } = await db
      .from('leads')
      .insert({ ...lead, prioridade: priority });
    if (error)
      throw new Error(
        'Não foi possível salvar sua solicitação. Tente novamente.',
      );
    if (
      process.env.RESEND_API_KEY &&
      process.env.LEADS_NOTIFY_EMAIL &&
      process.env.RESEND_FROM_EMAIL
    ) {
      after(async () => {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: process.env.RESEND_FROM_EMAIL,
              to: process.env.LEADS_NOTIFY_EMAIL,
              subject: `Novo contato — prioridade ${priority}`,
              text: `Um novo contato sobre ${lead.area} está disponível no painel. Acesse o painel autenticado para consultar os dados.`,
            }),
            signal: AbortSignal.timeout(5000),
          });
        } catch {
          /* The lead is already saved; notification does not change its status. */
        }
      });
    }
    return NextResponse.json({ ok: true, saved: true });
  } catch {
    return NextResponse.json(
      {
        error:
          'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.',
      },
      { status: 503 },
    );
  }
}
