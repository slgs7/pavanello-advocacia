import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/server';
import { fetchMetadata } from '@/lib/fetch-metadata';
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { error: 'Acesso não autorizado.' },
      { status: 401 },
    );
  }
  try {
    const { url } = await request.json();
    if (typeof url !== 'string' || url.length > 2048)
      throw new Error('Link inválido.');
    return NextResponse.json(await fetchMetadata(url));
  } catch {
    return NextResponse.json(
      {
        error:
          'Não foi possível buscar este link. Use uma página pública ou preencha os campos manualmente.',
      },
      { status: 400 },
    );
  }
}
