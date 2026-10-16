import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
 create role anon;create role authenticated;create role service_role bypassrls;
 create schema auth;grant usage on schema auth to anon,authenticated,service_role;
 create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt',true),''),'{}')::jsonb $$;
 create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
`);
  await db.exec(
    await readFile(
      new URL('../supabase/migrations/0001_init.sql', import.meta.url),
      'utf8',
    ),
  );
  await db.exec(`
 insert into public.admins(email) values('admin@example.test');
 insert into public.noticias(slug,titulo,fonte_nome,fonte_url,resumo,status,revisado,publicado_em) values
 ('publicada','Publicada','Fonte','https://example.test','Resumo','publicado',true,now()),
 ('rascunho','Rascunho','Fonte','https://example.test','Resumo','rascunho',false,null);
 insert into public.avaliacoes(autor,texto,ativo) values('Fixture A','Teste automatizado',true),('Fixture B','Teste automatizado',false);
 insert into public.leads(nome,whatsapp,area,momento,urgencia,consentimento_lgpd,prioridade) values('Fixture','64999991234','outro','avaliando','sem_pressa',true,'baixa');
`);
}, 20000);
afterAll(async () => {
  await db?.close();
});
async function asRole(role: string, email: string, task: () => Promise<void>) {
  await db.exec('begin');
  try {
    await db.exec(`set local role ${role}`);
    await db.query("select set_config('request.jwt',$1,true)", [
      JSON.stringify(
        email ? { email, sub: '00000000-0000-0000-0000-000000000001' } : {},
      ),
    ]);
    await task();
  } finally {
    await db.exec('rollback');
  }
}
describe('migração e políticas RLS em Postgres local', () => {
  it('visitante só lê notícias revisadas e avaliações ativas', async () => {
    await asRole('anon', '', async () => {
      expect(
        (await db.query('select * from public.noticias')).rows,
      ).toHaveLength(1);
      expect(
        (await db.query('select * from public.avaliacoes')).rows,
      ).toHaveLength(1);
    });
  });
  it('visitante não lê contatos', async () => {
    await asRole('anon', '', async () => {
      await expect(db.query('select * from public.leads')).rejects.toThrow(
        /permission denied/,
      );
    });
  });
  it('visitante não publica notícias', async () => {
    await asRole('anon', '', async () => {
      await expect(
        db.query("update public.noticias set status='publicado'"),
      ).rejects.toThrow(/permission denied/);
    });
  });
  it('usuário autenticado não autorizado não lê contatos nem rascunhos', async () => {
    await asRole('authenticated', 'outsider@example.test', async () => {
      expect((await db.query('select * from public.leads')).rows).toHaveLength(
        0,
      );
      expect(
        (await db.query('select * from public.noticias')).rows,
      ).toHaveLength(1);
      expect((await db.query('select * from public.admins')).rows).toHaveLength(
        0,
      );
    });
  });
  it('administrador lê rascunhos e altera o status do lead', async () => {
    await asRole('authenticated', 'admin@example.test', async () => {
      expect(
        (await db.query('select * from public.noticias')).rows,
      ).toHaveLength(2);
      expect((await db.query('select * from public.leads')).rows).toHaveLength(
        1,
      );
      await db.query("update public.leads set status='em_contato'");
      expect(
        (await db.query<{ status: string }>('select status from public.leads'))
          .rows[0].status,
      ).toBe('em_contato');
    });
  });
  it('mesmo administrador não altera dados pessoais do contato', async () => {
    await asRole('authenticated', 'admin@example.test', async () => {
      await expect(
        db.query("update public.leads set nome='Alterado'"),
      ).rejects.toThrow(/permission denied/);
    });
  });
  it('banco impede publicação de conteúdo não revisado', async () => {
    await expect(
      db.query(
        "update public.noticias set status='publicado' where slug='rascunho'",
      ),
    ).rejects.toThrow(/check constraint/);
  });
  it('limite durável aceita cinco envios e recusa o sexto', async () => {
    await asRole('service_role', '', async () => {
      for (let i = 0; i < 6; i++) {
        const result = await db.query<{ allowed: boolean }>(
          "select public.consume_lead_limit('teste') as allowed",
        );
        expect(result.rows[0].allowed).toBe(i < 5);
      }
    });
  });
  it('visitante não pode invocar a função de limite', async () => {
    await asRole('anon', '', async () => {
      await expect(
        db.query("select public.consume_lead_limit('teste')"),
      ).rejects.toThrow(/permission denied/);
    });
  });
});
