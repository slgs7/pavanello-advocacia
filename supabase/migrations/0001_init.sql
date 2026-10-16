-- Execute once in a fresh Supabase project. Do not add real customer data as seeds.
begin;
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table public.admins (email text primary key check (email = lower(email)));
create table public.noticias (
 id uuid primary key default gen_random_uuid(), slug text unique not null,
 titulo text not null, fonte_nome text not null, fonte_url text not null,
 imagem_url text, imagem_credito text, imagem_autorizada boolean not null default false, resumo text not null check(char_length(resumo)<=320),
 comentario text, area text, revisado boolean not null default false,
 status text not null default 'rascunho' check(status in ('rascunho','publicado')),
 publicado_em timestamptz, criado_em timestamptz not null default now(), atualizado_em timestamptz not null default now(),
 check(status <> 'publicado' or (revisado = true and publicado_em is not null))
);
create table public.avaliacoes (
 id uuid primary key default gen_random_uuid(), autor text not null, texto text not null,
 nota smallint not null default 5 check(nota between 1 and 5),
 origem text not null default 'Google Maps' check(origem='Google Maps'), quando text,url text,
 ativo boolean not null default false, criado_em timestamptz not null default now()
);
create table public.leads (
 id uuid primary key default gen_random_uuid(), criado_em timestamptz not null default now(),
 nome text not null,whatsapp text not null,cidade text,area text not null,
 momento text not null check(momento in ('contratar_agora','avaliando','so_duvida')),
 urgencia text not null check(urgencia in ('prazo_proximo','proximas_semanas','sem_pressa')),
 descricao text check(char_length(descricao)<=400), consentimento_lgpd boolean not null check(consentimento_lgpd=true),
 prioridade text not null check(prioridade in ('alta','media','baixa')),
 status text not null default 'novo' check(status in ('novo','em_contato','fechado','descartado')),
 origem_pagina text,utm jsonb
);
create table private.lead_limits (key text primary key, count integer not null default 1, expires_at timestamptz not null);
alter table public.admins enable row level security;
alter table public.noticias enable row level security;
alter table public.avaliacoes enable row level security;
alter table public.leads enable row level security;
alter table private.lead_limits enable row level security;

-- Deliberate, narrowly scoped definer helper: boolean lookup only, no arguments or mutations.
create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) is not null and exists(select 1 from public.admins where email=lower((select auth.jwt())->>'email'));
$$;
revoke all on function private.is_admin() from public,anon;
grant execute on function private.is_admin() to authenticated;
create policy admin_self_read on public.admins for select to authenticated using (email=lower((select auth.jwt())->>'email'));
create policy public_news on public.noticias for select to anon,authenticated using (status='publicado' and revisado=true);
create policy admin_news on public.noticias for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy public_reviews on public.avaliacoes for select to anon,authenticated using (ativo=true);
create policy admin_reviews on public.avaliacoes for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy admin_leads_read on public.leads for select to authenticated using ((select private.is_admin()));
create policy admin_leads_update on public.leads for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

revoke all on public.admins,public.noticias,public.avaliacoes,public.leads from anon,authenticated;
grant select on public.noticias,public.avaliacoes to anon;
grant select on public.admins to authenticated;
grant select,insert,update,delete on public.noticias,public.avaliacoes to authenticated;
grant select on public.leads to authenticated;
grant update(status) on public.leads to authenticated;
grant all on public.admins,public.noticias,public.avaliacoes,public.leads to service_role;

create index noticias_publicadas_idx on public.noticias(publicado_em desc) where status='publicado' and revisado=true;
create index noticias_area_idx on public.noticias(area);
create index leads_criado_idx on public.leads(criado_em desc);
create index leads_status_prioridade_idx on public.leads(status,prioridade);

-- Durable, atomic rate limit; only the server's service role can invoke it.
create function public.consume_lead_limit(bucket_key text) returns boolean language plpgsql security definer set search_path='' as $$
declare current_count integer;
begin
 delete from private.lead_limits where expires_at < now();
 insert into private.lead_limits(key,count,expires_at) values(bucket_key,1,now()+interval '1 hour')
 on conflict(key) do update set count=private.lead_limits.count+1
 returning count into current_count;
 return current_count <= 5;
end; $$;
revoke all on function public.consume_lead_limit(text) from public,anon,authenticated;
grant execute on function public.consume_lead_limit(text) to service_role;
commit;
