# Prompt 01 — Construir o site (front-end completo com dados de exemplo)

> Como usar: abra a pasta do projeto no ChatGPT/Codex (raciocínio alto ou extra alto) e cole este arquivo inteiro.

---

## Papel

Você é designer e desenvolvedor sênior, com olho de diretor de arte. Vai construir o site institucional da **Pavanello Advogados** (Rio Verde, GO) em Next.js. O cliente quer um site **diferente, realmente bonito e com muito ar**, que pareça de uma advocacia específica e não de qualquer escritório, e que traga **leads qualificados** pelo Google.

## Antes de escrever código (obrigatório)

1. Leia, nesta ordem: `AGENTS.md`, `README.md`, `briefing.md`, `design-system.md` e os arquivos de `referencias/`. Olhe a logo e a foto.
2. Confira se os tokens de cor combinam com a logo. Se precisar ajustar um tom, ajuste em `design-system.md` e diga o que mudou e por quê.
3. Escreva um plano curto (até 25 linhas): sitemap, componentes e a ordem das seções da home com um esboço em ASCII.
4. Revise o plano contra o briefing. Se alguma parte for o que você faria para **qualquer** escritório (preto e dourado genérico, cards iguais repetidos, fade-in em toda seção, ícone em círculo), troque e diga o que trocou.
5. Só então programe.
6. Não faça perguntas se puder assumir. Liste as suposições no relatório final. Pergunte apenas se faltar algo que impeça de continuar.

## Escopo desta etapa

Front-end completo com **dados de exemplo em arquivos locais**, sem banco. Deixe tudo preparado para o prompt 02 trocar os dados por Supabase sem refatorar:

- `lib/data/noticias.ts`, `lib/data/avaliacoes.ts` e `lib/data/areas.ts` exportam funções `async` (`listarNoticias()`, `obterNoticia(slug)`, `listarAvaliacoes()`, `listarAreas()`) que hoje leem de `content/`.
- `site.config.ts` concentra nome, endereço, telefone, e-mail, horário, URLs e redes (fonte única).
- O formulário de contato funciona na interface e valida, mas o envio chama uma função `enviarLead()` ainda simulada.

## Stack

Next.js (App Router, versão estável mais recente), TypeScript estrito, Tailwind CSS com os tokens do `design-system.md`, `next/font` (Fraunces e Schibsted Grotesk), `next/image`, pacote `motion` para animação, ESLint e Prettier. Zod para validação.

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Home, na ordem do esboço de `design-system.md` (hero, áreas, avaliações, como atendemos, o escritório, notícias, contato) |
| `/sobre` | Quem somos: história e forma de trabalho (rodízio de especialistas). **Sem** página de advogados e **sem** artigos |
| `/areas-de-atuacao` | Índice das áreas |
| `/areas-de-atuacao/[slug]` | Uma página por área do `briefing.md` (seção 3) |
| `/noticias` | Vitrine com filtro por área e paginação |
| `/noticias/[slug]` | Notícia: título, fonte e data, miniatura com crédito, comentário do escritório, botão "Ler a matéria original", CTA da área relacionada |
| `/contato` | Formulário em etapas, WhatsApp, endereço, horário, link "Abrir no Google Maps" |
| `/privacidade`, `/aviso-legal` | LGPD e Provimento 205/2021 |
| `not-found` | 404 com humor leve (texto do briefing) |
| `sitemap.xml`, `robots.txt`, ícones, imagem de compartilhamento | Gerados pelo Next |

### Página de área (modelo para todas)

1. H1 no padrão "Direito trabalhista em Rio Verde" (palavra-chave + cidade, escrito de forma natural).
2. Introdução curta: o que a área cobre.
3. "Situações em que podemos ajudar": lista de 5 a 8 itens.
4. "Como funciona o atendimento": os 4 passos.
5. Perguntas frequentes (conteúdo apenas, sem marcação de FAQ).
6. Chamada para o formulário com a área já selecionada.
7. Notícias relacionadas àquela área.

Escreva o conteúdo como **rascunho informativo**, sem aconselhamento específico, sem promessa de resultado e sem citar leis ou prazos que você não tenha certeza. Marque cada área com `revisado: false` no conteúdo. Em desenvolvimento, mostre uma faixa discreta "Texto aguardando revisão do escritório" nas páginas não revisadas.

## Home: especificação das seções

**Hero (escuro, `--grad-ink`).** Texto à esquerda: H1 "Advocacia em Rio Verde que vai direto ao ponto.", subtítulo e dois botões (principal "Falar no WhatsApp", secundário "Ver áreas de atuação"). À direita, retrato 4:5 com os ramos de louro da logo grandes, recortados e em dourado a 8 a 12% de opacidade atrás dele. Abaixo do texto, o selo de prova: "5,0", cinco estrelas e "247 avaliações no Google", com link para `NEXT_PUBLIC_GOOGLE_MAPS_URL`. Enquanto não houver foto, use o `ImageSlot` elegante.

**Áreas (marfim).** Índice tipográfico em duas colunas, como no design system. Cada linha leva à página da área.

**Avaliações (escuro).** Carrossel descrito abaixo.

**Como atendemos (marfim).** Quatro passos em linha: você conta o caso, triagem com o advogado da área, análise e reunião, acompanhamento. Uma frase explica o rodízio: "cada caso vai para o especialista da área".

**O escritório (escuro).** Galeria com 6 espaços de imagem vazios (`ImageSlot`) em proporção 3:2, em grade assimétrica. As fotos entram depois por um arquivo `content/escritorio.ts` com a lista de imagens. Se a lista estiver vazia em produção, a seção não é exibida.

**Notícias (marfim).** Três mais recentes: um destaque grande e dois menores. Link "Ver todas as notícias".

**Contato (escuro, `--grad-ink`).** Formulário em etapas ao lado de endereço, horário e WhatsApp.

## Funcionalidades

### Carrossel de avaliações
- Pool de avaliações vindo de `listarAvaliacoes()`. Mostra uma em destaque e vizinhas menores.
- Troca sozinha a cada 7 s com cruzamento de 500 ms. **Não repete** uma avaliação até esgotar o pool; embaralhar a ordem a cada visita (cuidado com hydration: embaralhar no servidor ou depois da montagem).
- Controles visíveis (anterior, próxima, pausar). Pausa com mouse, foco e toque.
- Cada item mostra o texto **exato**, o autor e "Avaliação no Google Maps". Se o texto for longo, cortar com "ler mais" sem editar o conteúdo.
- `prefers-reduced-motion`: lista estática com botão "Ver mais avaliações".
- Dados de exemplo: as 3 avaliações do `briefing.md` (seção 9), mais 5 a 7 avaliações marcadas como `exemplo: true` para testar a rotação. Não faça as avaliações de exemplo parecerem reais: em produção, só entram as marcadas como reais.

### Formulário qualificado (4 etapas)
1. Assunto: lista com as áreas e "Outro assunto".
2. Momento: "Quero contratar um advogado agora", "Estou avaliando opções", "Só tenho uma dúvida".
3. Urgência: "Tenho prazo ou audiência próxima", "Preciso resolver nas próximas semanas", "Sem pressa".
4. Contato: nome, WhatsApp (com máscara), cidade (padrão "Rio Verde"), breve descrição opcional (até 400 caracteres), caixa de consentimento LGPD com link para `/privacidade`.

Regras:
- Validação com Zod no cliente e no servidor. Campo oculto (honeypot) contra robôs.
- `enviarLead()` retorna `{ ok, prioridade }`, em que prioridade é interna ("alta", "média", "baixa") e **nunca aparece para o visitante**.
- Tela final: mensagem humana e botão "Abrir WhatsApp" que abre `https://wa.me/<numero>?text=<mensagem>` com a mensagem pronta resumindo assunto, momento e urgência.
- Para "Só tenho uma dúvida": mostrar também links úteis (notícias e a página da área). O botão de WhatsApp continua disponível.
- Texto de apoio: a primeira conversa serve para entender o caso e indicar o advogado da área. **Sem** valores, gratuidade ou desconto.
- Eventos de medição `whatsapp_click` e `lead_submit` (com `area` e `momento`), carregando o GA4 só após consentimento.

### Botão flutuante de WhatsApp
Discreto, canto inferior direito, respeitando área segura do celular. Não pode cobrir conteúdo nem o formulário.

## SEO local

- Metadados por página (título, descrição, canonical, Open Graph). Padrão de título: "Advogado trabalhista em Rio Verde | Pavanello Advogados" (adaptar por área, sem repetir palavra-chave de forma forçada).
- JSON-LD `LegalService` na home e em `/contato`, com nome, URL, telefone, endereço, horário, área atendida (Rio Verde) e redes sociais. **Não inclua `aggregateRating` nem `Review`.** Incluir `BreadcrumbList` nas páginas internas e `Article` nas notícias.
- `sitemap.ts` com todas as páginas, `robots.ts`, `lang="pt-BR"`.
- Nome, endereço e telefone sempre iguais aos de `site.config.ts` (devem bater com o Perfil da Empresa no Google).
- Cada área e cada notícia tem URL própria, limpa e indexável.

## Desempenho e acessibilidade

- Meta: Lighthouse no celular acima de 90 em desempenho, acessibilidade, SEO e boas práticas, na home.
- Imagem do hero com `priority`; demais com carregamento tardio. Sem salto de layout.
- WCAG AA: contraste, foco visível, link "Pular para o conteúdo", landmarks, labels em todos os campos, navegação por teclado completa (menu, carrossel, formulário).

## Conformidade (OAB e LGPD)

- Rodapé com o texto do `briefing.md` (seção 13) e espaço para identificação da OAB (`[PENDENTE]` se faltar).
- Sem promessa de resultado, sem valores, sem gratuidade, sem superlativos, sem logotipo da OAB.
- `/privacidade` com finalidades, dados coletados (nome, WhatsApp, cidade, descrição), base legal (consentimento), retenção e contato do responsável (`[PENDENTE]`).

## Proibido

- Foto de banco de imagens de martelo, balança ou aperto de mão.
- Lorem ipsum, telefones falsos, nomes de advogados ou números de OAB inventados, estatísticas inventadas.
- Emojis na interface (exceto dentro do texto literal de uma avaliação).
- Rótulo em maiúsculas acima de títulos, numeração fora dos 4 passos, destaque de uma palavra do título, setas "→" em links, degradê em texto corrido.
- Valores de espaço ou raio fora dos tokens.

## Entregáveis

1. Projeto Next.js rodando com `npm run dev`, `npm run lint` e `npm run build` sem erros.
2. `site.config.ts`, `content/`, `lib/data/` e componentes organizados.
3. `README` do código com como rodar e onde editar textos, áreas, avaliações e fotos do escritório.
4. Se conseguir rodar Playwright, um script `scripts/screenshots.mjs` que salva prints de cada página em 390, 768 e 1440 px na pasta `qa/`.
5. Relatório final: o que foi feito, suposições, pendências e como testar.

## Critérios de aceite

- [ ] Todo o checklist da seção 12 do `design-system.md` passa.
- [ ] As 11 páginas de área e a vitrine de notícias existem com dados de exemplo.
- [ ] O carrossel troca sozinho, não repete e tem pausa.
- [ ] O formulário valida, resume e abre o WhatsApp com a mensagem pronta.
- [ ] O `ImageSlot` do escritório está pronto para receber fotos sem mexer no layout.
- [ ] Nenhuma informação inventada. Tudo que falta está como `[PENDENTE]` e listado no relatório.
