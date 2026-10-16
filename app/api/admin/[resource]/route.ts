import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/server';
import { newsSchema, reviewSchema, statusSchema } from '@/lib/admin-schemas';
import { slugify } from '@/lib/slug';
const resources = ['noticias', 'avaliacoes', 'leads'];
type Context = { params: Promise<{ resource: string }> };
export async function GET(_request: Request, { params }: Context) {
  const { resource } = await params;
  if (!resources.includes(resource))
    return NextResponse.json(
      { error: 'Página não encontrada.' },
      { status: 404 },
    );
  try {
    const db = await requireAdmin();
    const { data, error } = await db
      .from(resource)
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json(
      { data },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          'Não foi possível acessar os dados. Verifique seu acesso e a configuração do banco.',
      },
      { status: 403 },
    );
  }
}
async function mutate(request: Request, { params }: Context) {
  const { resource } = await params;
  if (!resources.includes(resource))
    return NextResponse.json({ error: 'Recurso inválido.' }, { status: 404 });
  try {
    const db = await requireAdmin();
    const payload = await request.json();
    const id = payload.id;
    if (id && !/^[0-9a-f-]{36}$/i.test(id))
      return NextResponse.json(
        { error: 'Identificador inválido.' },
        { status: 400 },
      );
    if (request.method === 'DELETE') {
      if (!id || resource === 'leads')
        return NextResponse.json(
          { error: 'Operação indisponível.' },
          { status: 400 },
        );
      const { error } = await db.from(resource).delete().eq('id', id);
      if (error) throw error;
    } else {
      const schema =
        resource === 'noticias'
          ? newsSchema
          : resource === 'avaliacoes'
            ? reviewSchema
            : statusSchema;
      const result = schema.safeParse(payload);
      if (!result.success)
        return NextResponse.json(
          { error: result.error.issues[0].message },
          { status: 400 },
        );
      if (resource === 'leads' && !id)
        return NextResponse.json(
          { error: 'Identificador obrigatório.' },
          { status: 400 },
        );
      let record: Record<string, unknown> = { ...result.data };
      if (resource === 'noticias') {
        const news = newsSchema.parse(payload);
        let published: string | null = null;
        if (id) {
          const existing = await db
            .from('noticias')
            .select('publicado_em')
            .eq('id', id)
            .single();
          published = existing.data?.publicado_em || null;
        }
        record = {
          ...news,
          atualizado_em: new Date().toISOString(),
          publicado_em:
            news.status === 'publicado'
              ? published || new Date().toISOString()
              : null,
        };
        if (!id)
          record.slug = `${slugify(news.titulo)}-${crypto.randomUUID().slice(0, 8)}`;
      }
      const query = id
        ? db.from(resource).update(record).eq('id', id)
        : db.from(resource).insert(record);
      const { error } = await query;
      if (error) throw error;
    }
    revalidatePath('/');
    revalidatePath('/noticias');
    revalidatePath('/noticias/[slug]', 'page');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error: 'Não foi possível salvar. Verifique o acesso e tente novamente.',
      },
      { status: 403 },
    );
  }
}
export const POST = mutate;
export const PUT = mutate;
export const DELETE = mutate;
