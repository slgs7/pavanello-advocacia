# Site implementado — guia de uso

## Executar

Requer Node.js 20.9 ou superior. Ambiente verificado com Node 24.

```powershell
npm install
npm run dev
```

Abra http://localhost:3000. O painel está em `/admin/login`.

```powershell
npm run lint
npm test
npm run build
npm start
```

O arquivo `package-lock.json` fixa as versões. Use `npm ci` em integração contínua.

## Onde editar

| Informação                                         | Arquivo                                        |
| -------------------------------------------------- | ---------------------------------------------- |
| Nome, endereço, telefone, e-mail, horário e OAB    | `site.config.ts`                               |
| Áreas, assuntos e aprovação jurídica               | `content/areas.ts`                             |
| Textos institucionais e política de privacidade    | `content/institucional.ts`                     |
| Retrato e fotos do escritório                      | `content/escritorio.ts`                        |
| Avaliações de referência, preservadas literalmente | `content/avaliacoes.ts`                        |
| Prévias editoriais claramente identificadas        | `content/noticias.ts`                          |
| Tokens e componentes visuais                       | `app/globals.css`, conforme `design-system.md` |

Coloque fotos autorizadas em `public/` e cadastre seus caminhos e textos alternativos. O retrato original ainda não foi fornecido. A captura do Instagram foi usada apenas como referência, conforme `referencias/LEIA-ME.md`. O painel da marca reserva a composição do hero sem fabricar uma fotografia. A galeria vazia desaparece em produção.

Os textos de área e da política estão com `revisado: false`. Os textos jurídicos detalhados ficam visíveis somente em desenvolvimento até aprovação. As áreas não revisadas não entram no sitemap. Prévias de notícias não são notícias reais e não aparecem em produção.

## Conectar Supabase

1. Crie ou selecione um projeto Supabase do escritório. Este trabalho não criou nem alterou projetos externos.
2. No SQL Editor, execute `supabase/migrations/0001_init.sql` uma única vez em um banco vazio. A migração cria tabelas, índices, permissões, RLS e limite durável de envios.
3. Em Authentication, crie o usuário da equipe com e-mail confirmado e senha segura. Desative cadastro público se não for necessário. O site não oferece cadastro.
4. Insira o primeiro administrador pelo SQL Editor, substituindo o exemplo pelo e-mail real em minúsculas:

```sql
insert into public.admins(email) values ('email-da-equipe@dominio.com');
```

5. Copie `.env.example` para `.env.local`. Preencha URL, chave publishable, service role e `ADMIN_EMAILS`. A pessoa deve estar tanto na lista de ambiente quanto em `admins`.
6. Gere `RATE_LIMIT_SECRET` com pelo menos 32 bytes aleatórios. A chave service role e esse segredo só ficam no servidor.
7. Reinicie o servidor e entre em `/admin/login`. Não use credenciais reais em screenshots ou arquivos de teste.

O painel usa senha e cookies de sessão do Supabase SSR. A sessão é validada no servidor e as tabelas aplicam RLS. Cookies são renovados no proxy. Alterações passam novamente pela autorização no endpoint. Leads só podem ser inseridos pelo servidor; administradores podem ler e alterar exclusivamente o status.

### Notícias

Cole um link, clique em Buscar dados, confira título/fonte/resumo e escreva o comentário. O importador só lê metadados; não copia o artigo. A busca fixa o IP público validado na conexão, verifica novamente cada redirecionamento, limita a 3 redirecionamentos, 5 segundos e 1 MB, e exige HTML. Uma falha permite preenchimento manual.

Miniaturas ficam desativadas até marcar a permissão de reprodução. Imagens autorizadas são exibidas com crédito, por `next/image` sem otimização remota no servidor. Se falharem, aparece o louro. Publicar exige a confirmação de revisão por advogado, validada também no servidor e por restrição SQL. O slug permanece estável na edição.

### Avaliações

Cole o texto exato e completo. Novas avaliações no painel começam inativas. O conjunto local contém as 12 avaliações fornecidas pelo cliente em 15/10/2026, em `content/avaliacoes-google.ts`, e já está habilitado conforme sua solicitação. O texto de Maria Lopes foi conferido e expandido no perfil do Google Maps; reticências presentes nos demais textos fornecidos foram preservadas. `NEXT_PUBLIC_REVIEWS_APPROVED=false` desativa a exibição em produção. Com o Supabase configurado, a fonte passa a ser a tabela de avaliações ativas; cadastre nela as avaliações que deseja exibir.

O componente adaptado do código fornecido está em `components/ui/card-fan-carousel.tsx`, com GSAP, sete posições em leque e troca a cada 5 segundos. Transições de 1,15s mantêm continuidade entre as posições. Pausa com mouse, foco ou diálogo aberto; fora da tela não avança. O botão central de pausa foi removido. Movimento reduzido ou “Ler todas sem movimento” apresenta lista estática. O diretório `components/ui` e `components.json` seguem as convenções shadcn; não é necessário recriar o projeto.

A timeline usa `components/ui/timeline-01.tsx` e `timeline-01-utils/timeline.tsx`, completando a dependência ausente no exemplo fornecido. Usa Motion já instalado e tokens existentes; não depende do Badge nem das imagens demonstrativas. As explicações dos 55 assuntos ficam em `content/temas-areas.ts`, com revisão individual `revisado: false`, e suas fontes estão em `docs/fontes-temas.md`. Links dos chips abrem a página da área diretamente no assunto.

O botão flutuante em `components/floating-contact.tsx` aponta para `#contato` nas páginas com formulário e para `/contato#contato` nas demais. O WhatsApp é oferecido na conclusão do fluxo, preservando a qualificação inicial.

### Contatos e prioridade

Alta: quer contratar e tem prazo próximo ou precisa resolver nas próximas semanas. Baixa: só dúvida, ou está avaliando sem pressa. Média: demais combinações. A prioridade é calculada no servidor e nunca devolvida ao visitante.

Sem credenciais, o formulário valida e prepara o WhatsApp, mas explica que nada foi enviado pelo site. Com credenciais, salva no Supabase antes de confirmar. O honeypot e a validação também são aplicados no servidor. São permitidos 5 envios por IP por hora. Na Vercel, usa-se o cabeçalho da plataforma `x-vercel-forwarded-for`; o banco guarda somente HMAC do IP, com expiração de uma hora. Fora da Vercel, o limite usa um bucket único conservador; adapte a origem confiável de IP se mudar a hospedagem.

### E-mail e medição

Resend é opcional: configure a chave, destinatário e `RESEND_FROM_EMAIL` de domínio verificado. O aviso contém área e prioridade, sem dados pessoais; os dados ficam no painel autenticado. Falha de e-mail não desfaz um lead salvo. A entrega real precisa ser testada após a configuração.

GA4 só é carregado se `NEXT_PUBLIC_GA4_ID` for válido e o visitante aceitar. Eventos: `whatsapp_click` e `lead_submit`, sem nome, telefone ou descrição. Preferências podem ser revistas no rodapé.

## Validação reproduzível

- `npm test`: validações, nove cenários de prioridade, slugs, URLs e IPs privados; importador com DNS/redirecionamentos/respostas simulados; migração e RLS executadas em Postgres local via PGlite.
- `npm run screenshots`: 19 rotas em 390, 768, 1440 e 1920 px, com checagem de status e rolagem horizontal. Salva em `qa/`.
- `node scripts/verify-ui.mjs`: menu móvel, envio em quatro etapas, WhatsApp, filtros, área pré-selecionada, APIs administrativas e 404.
- `node scripts/accessibility.mjs`: verificação automatizada WCAG A/AA com axe em seis páginas.

Os scripts de navegador usam o Microsoft Edge instalado e o servidor local na porta 3000. Não substituem revisão manual de acessibilidade. PGlite verifica a migração e RLS com contexto de autenticação simulado; não valida as credenciais, SMTP ou configuração de um projeto Supabase remoto.

## Publicação e pendências

Siga também `docs/publicacao.md`, preservando os registros de e-mail da Web Mix. Cadastre variáveis na Vercel; nunca envie `.env.local` ao Git.

Antes de liberar indexação (`NEXT_PUBLIC_SITE_READY=true`):

- Confirmar nome oficial, áreas efetivamente oferecidas e horário.
- Receber nome da coordenadora, identificação da sociedade e responsável/OAB.
- Receber retrato original, fotos do escritório e logo em resolução maior.
- Maps e Instagram já configurados a partir do perfil conferido e do link fornecido pelo cliente.
- Se desejar remover as reticências de Maiara e Alessandra, fornecer os textos expandidos; não completar por suposição.
- Revisar conteúdos jurídicos e política, incluindo responsável e prazo de retenção; alterar os respectivos campos `revisado`.
- Configurar Supabase, testar login e gravação real; configurar Resend se desejado.
- Testar publicação/rascunho, ativação de avaliações e mudança de status dos contatos no projeto real.
- Conferir DNS, domínio, Google Business e Search Console.

O site não foi publicado nem o DNS alterado. O controle de indexação começa desativado, preservando as exigências de revisão dos materiais fornecidos.
