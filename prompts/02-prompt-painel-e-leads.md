# Prompt 02 — Painel de notícias, avaliações e leads (com banco)

> Como usar: rode depois do prompt 01 e do QA visual. Cole este arquivo inteiro no ChatGPT/Codex, com o projeto já funcionando.

---

## Papel e objetivo

Você vai trocar os dados de exemplo por dados reais em **Supabase** e construir um **painel simples** para a equipe do escritório. Antes de mexer, leia `AGENTS.md`, `briefing.md` (seções 5, 9 e 10) e o código atual de `lib/data/`.

O painel precisa ser tão simples que a coordenadora use sozinha: **colar o link de uma notícia e publicar**.

## Escopo

1. Banco no Supabase com três tabelas: `noticias`, `avaliacoes` e `leads`.
2. Login do painel (Supabase Auth) restrito a e-mails autorizados.
3. `/admin/noticias`: criar, editar e publicar notícias a partir de um link.
4. `/admin/avaliacoes`: adicionar e ativar avaliações do Google.
5. `/admin/leads`: lista de leads com prioridade e status.
6. Trocar `lib/data/*` e `enviarLead()` por versões reais, sem mudar os componentes.
7. E-mail de aviso a cada lead novo (opcional, Resend).

## Banco (arquivo `supabase/migrations/0001_init.sql`)

```sql
create table public.admins (
  email text primary key
);

create table public.noticias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  fonte_nome text not null,
  fonte_url text not null,
  imagem_url text,
  imagem_credito text,
  resumo text not null check (char_length(resumo) <= 320),
  comentario text,              -- "o que isso muda para você", escrito pelo escritório
  area text,                    -- slug da área
  status text not null default 'rascunho' check (status in ('rascunho','publicado')),
  publicado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  autor text not null,
  texto text not null,
  nota smallint not null default 5 check (nota between 1 and 5),
  origem text not null default 'Google Maps',
  quando text,                  -- como aparece no Google, ex.: "2 meses atrás"
  url text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  nome text not null,
  whatsapp text not null,
  cidade text,
  area text not null,
  momento text not null check (momento in ('contratar_agora','avaliando','so_duvida')),
  urgencia text not null check (urgencia in ('prazo_proximo','proximas_semanas','sem_pressa')),
  descricao text check (char_length(descricao) <= 400),
  consentimento_lgpd boolean not null check (consentimento_lgpd = true),
  prioridade text not null check (prioridade in ('alta','media','baixa')),
  status text not null default 'novo' check (status in ('novo','em_contato','fechado','descartado')),
  origem_pagina text,
  utm jsonb
);
```

**RLS ligada nas quatro tabelas.** Políticas:
- `noticias`: leitura pública só de `status = 'publicado'`. Escrita só para quem está em `admins`.
- `avaliacoes`: leitura pública só de `ativo = true`. Escrita só para `admins`.
- `leads`: **nenhuma** política pública. O formulário grava pelo servidor (Route Handler ou Server Action) com a chave `service role`. Leitura e edição só para `admins`.
- `admins`: sem acesso público.

Crie também uma função `is_admin()` baseada no e-mail do JWT e use nas políticas. Inclua no README do código o passo para colar o SQL no editor do Supabase e inserir o primeiro e-mail em `admins`.

## Painel de notícias (o coração desta etapa)

Rota `/admin/noticias/nova`. Fluxo:

1. Campo **Link da notícia**. Botão "Buscar dados".
2. O servidor busca a página e extrai título, descrição, imagem e nome do site pelas tags Open Graph (`og:title`, `og:description`, `og:image`, `og:site_name`). Preenche os campos, **todos editáveis**.
3. A equipe escreve:
   - **Resumo** (até 320 caracteres, com o contador na tela).
   - **O que isso muda para você** (comentário do escritório, texto simples com parágrafos). É o conteúdo próprio que ajuda no Google.
   - **Área do direito** (lista das áreas) para relacionar a notícia.
4. Botões "Salvar rascunho" e "Publicar". Ao publicar, gerar o `slug` a partir do título, definir `publicado_em` e revalidar as páginas de notícias (ISR com `revalidatePath`).
5. Lista em `/admin/noticias` com status, data e ações (editar, despublicar, excluir com confirmação).

### Segurança da busca do link (obrigatório)
A busca do servidor é um ponto de risco. Implemente:
- Aceitar só `http` e `https`.
- Resolver o DNS e **bloquear IPs privados, loopback e link-local** (10.x, 172.16–31.x, 192.168.x, 127.x, 169.254.x, `::1` e equivalentes), inclusive após redirecionamentos.
- Máximo de 3 redirecionamentos, tempo limite de 5 s e leitura de no máximo 1 MB.
- Aceitar só `text/html`.
- Rota acessível apenas para admins autenticados.
- Se a busca falhar, mostrar mensagem clara e deixar preencher à mão.

### Direito autoral
Guardar e exibir só: título, resumo curto, miniatura com crédito da fonte e link. **Não copiar o texto da matéria.** Na página pública: "Fonte: {nome do site}" e botão "Ler a matéria original" (abre em nova aba, `rel="noopener noreferrer"`). Se a imagem não puder ser usada, usar o fundo de louro do design system.

## Página pública de notícia

Título, fonte e data, miniatura com crédito, resumo, bloco "O que isso muda para você" em destaque (é a parte do escritório), link para a matéria original, CTA para a área relacionada com o formulário já preenchido e notícias relacionadas. `Article` em JSON-LD com o escritório como autor do comentário. Notícias em rascunho nunca aparecem nem entram no sitemap.

## Avaliações

- `/admin/avaliacoes`: formulário com autor, texto (colado do Google, **sem alterar**), nota, "quando" e link opcional. Ativar e desativar.
- A faixa do site usa só `ativo = true` e `exemplo` falso. Mantém as regras do carrossel do prompt 01.
- Lembrete na tela do painel: "Cole o texto exatamente como o cliente escreveu. Não edite nem resuma."

## Leads

- `enviarLead()` valida no servidor (Zod), checa o honeypot, limita por IP (simples, por exemplo 5 envios por hora) e grava com `service role`.
- Calcule a prioridade no servidor: **alta** = contratar agora com prazo próximo ou próximas semanas; **baixa** = só dúvida ou sem pressa com "avaliando"; **média** = o resto. Ajuste se achar mais coerente e documente a regra no README.
- Se `RESEND_API_KEY` existir, envie e-mail para `LEADS_NOTIFY_EMAIL` com o resumo e a prioridade no assunto. Sem chave, apenas grave.
- Nada de dado de lead em log, no cliente ou no JSON-LD.
- `/admin/leads`: tabela ordenada por data com filtro por prioridade e status, botão para abrir o WhatsApp do lead e alterar o status.

## Login

- Supabase Auth com link mágico por e-mail (ou e-mail e senha). Só entram e-mails de `ADMIN_EMAILS` e da tabela `admins`.
- Middleware protegendo `/admin/*`. Sessão segura e `noindex` em todo o painel.
- Interface do painel no mesmo design system, mais simples: sem animação decorativa, foco em clareza e botões grandes.

## Variáveis de ambiente

Use as de `.env.example`. A chave `SUPABASE_SERVICE_ROLE_KEY` só no servidor, nunca em código do cliente nem em `NEXT_PUBLIC_`. Documente como cadastrar tudo na Vercel.

## Entregáveis

1. Migração SQL, políticas RLS e passo a passo no README do código.
2. Painel funcionando com dados reais.
3. `lib/data/*` e `enviarLead()` ligados ao Supabase, com fallback para os dados de exemplo em desenvolvimento quando não houver variáveis.
4. Testes simples (Vitest) para: prioridade do lead, geração de slug, bloqueio de IP privado na busca do link e validação do formulário.
5. Relatório final: o que foi feito, suposições, riscos e pendências.

## Critérios de aceite

- [ ] Colar um link e publicar leva menos de 2 minutos.
- [ ] Notícia em rascunho não aparece no site nem no sitemap.
- [ ] Link para `http://127.0.0.1` ou `http://192.168.0.1` é recusado.
- [ ] Visitante anônimo não consegue ler `leads` nem escrever em nada.
- [ ] O formulário grava, calcula prioridade e abre o WhatsApp com a mensagem pronta.
- [ ] `npm run lint`, `npm test` e `npm run build` passam.
