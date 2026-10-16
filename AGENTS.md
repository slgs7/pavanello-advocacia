# AGENTS.md — instruções para o agente de código

Projeto: site da Pavanello Advogados (Rio Verde, GO).
Tudo que o visitante lê é em português do Brasil. Nomes de arquivos e de código: escolha um idioma e mantenha.

## Ordem de leitura

1. `README.md`
2. `briefing.md`
3. `design-system.md`
4. `referencias/` (logo e fotos)
5. O prompt pedido em `prompts/`

## Fontes da verdade

- Dados do escritório (nome, endereço, telefone, e-mail, horário): arquivo `site.config.ts`, preenchido a partir de `briefing.md`. Não repita esses dados dentro de componentes.
- Cores, fontes, espaços e raios: tokens de `design-system.md`. Sem valores soltos no CSS.

## Regras que não podem ser quebradas

- **Não invente dados**: nomes de advogados, números de OAB, CNPJ, anos de atuação, número de clientes, prêmios, resultados de processos. Se faltar, use um marcador visível só em desenvolvimento (`[PENDENTE: ...]`) e liste no relatório final.
- **Publicidade de advocacia** segue o Provimento 205/2021 do CFOAB: informativa e moderada. Sem promessa de resultado, sem valores, gratuidade ou desconto, sem superlativos ("o melhor"), sem ostentação, sem logotipo ou símbolo da OAB.
- **Avaliações**: mostrar o texto exatamente como o cliente escreveu, com a origem ("Google Maps"). Nunca editar nem inventar.
- **Dados estruturados**: usar `LegalService`. Não usar `aggregateRating` nem `Review` do próprio escritório.
- **Texto jurídico gerado é rascunho**: marque `revisado: false` no conteúdo. Só vai para produção depois de revisão por advogado.
- **Segredos** só em variáveis de ambiente. Nunca comitar `.env`. A chave `service role` do Supabase fica só no servidor.

## Padrões de código

- Next.js (App Router, versão estável mais recente), TypeScript estrito, Tailwind CSS, ESLint e Prettier.
- Componentes pequenos em `components/`, regras de negócio em `lib/`, textos em `content/`.
- `next/image` para imagens e `next/font` para fontes, sem salto de layout.
- Acessibilidade WCAG AA: foco visível, `prefers-reduced-motion` respeitado, todo campo com label.
- Antes de dizer que terminou, `npm run lint` e `npm run build` precisam passar.

## Relatório final (sempre)

O que foi feito, suposições assumidas, pendências, como rodar e o que testar.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
