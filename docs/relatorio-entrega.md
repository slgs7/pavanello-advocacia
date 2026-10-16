# Relatório de implementação — 15/10/2026

Atualização posterior: [revisão de 16/10/2026](revisao-16-10-2026.md), com timeline das áreas, explicações dos temas, carrossel de 5 segundos e botão flutuante para captação. As descrições de 8 segundos abaixo registram a entrega anterior.

## Revisão visual solicitada pelo cliente

- Hero: logo e nome em uma composição vertical sem sobreposição; botão “Fale conosco” aponta para o formulário `#contato`.
- Uma única família tipográfica, Schibsted Grotesk, em títulos, textos e interface.
- Ordem da home: hero, áreas, atendimento, escritório, formulário, avaliações, mapa, notícias e rodapé.
- Atendimento com quatro painéis, números em destaque e convite para iniciar o formulário.
- Instagram oficial informado pelo cliente e WhatsApp em ícones circulares junto à navegação, também disponíveis no menu móvel.
- Filtro de notícias com lista personalizada em marfim e dourado, indicação de seleção e navegação por teclado.
- Carrossel em leque adaptado do código fornecido, em `components/ui/card-fan-carousel.tsx`, usando GSAP. Doze cartões sem numeração, intervalo de 8 segundos, anterior/próxima, pausa e diálogo de leitura. Preferência de movimento reduzido usa lista estática.
- Avaliações fornecidas pelo cliente preservadas em `content/avaliacoes-google.ts`. O texto expandido de Maria Lopes e o perfil/endereço do Google Maps foram conferidos no navegador. Os demais textos vieram da mensagem do cliente; as reticências de Maiara e Alessandra foram mantidas. Não foi necessário aguardar login nem inventar avaliações.
- Estrutura `components/ui` e `components.json` compatíveis com as convenções shadcn. TypeScript e Tailwind já estavam instalados.

Validação desta revisão: `npm run lint`, `npm run build` e 49 testes aprovados. No navegador foram conferidos a hero, o destino do CTA, as 12 avaliações, a troca automática, os controles, o diálogo, o filtro por teclado e o resultado da filtragem. Largura móvel de 390px sem overflow horizontal na home; logo e nome separados por 16px. Captura da revisão em `qa/revisao-avaliacoes.jpg`. As evidências de axe e das 76 capturas abaixo pertencem à implementação anterior e não foram repetidas integralmente nesta revisão.

Suposições: mantido o nome Pavanello Advogados conforme arquivos e perfil oficial; escolhido o uso de uma única fonte; o pedido explícito de usar as 12 avaliações habilita o conjunto local. Fotos originais, dados profissionais pendentes e configuração remota continuam pendentes. Reticências só devem ser substituídas quando houver o texto expandido original.

## Implementado

- Next.js App Router, TypeScript estrito, Tailwind CSS, fonte Schibsted Grotesk, Motion e GSAP, imagens com dimensões reservadas, ESLint e Prettier.
- Home, Quem somos, índice e 11 páginas de áreas, notícias com filtro/paginação e detalhe, contato, privacidade, aviso legal e 404.
- Identidade da pasta: preto quente, marfim, dourado, logo e louros; áreas em índice tipográfico; quatro passos reais de atendimento.
- Formulário de quatro etapas com validação no cliente e servidor, consentimento, máscara, qualificação e WhatsApp. Nenhuma confirmação falsa de armazenamento sem banco.
- Carrossel com ordem embaralhada no servidor, pausa, controles e alternativa estática para reduzir movimento. Textos das avaliações preservados; sem avaliações inventadas.
- Painel com login, cadastro/edição/publicação/despublicação/exclusão de notícias, importação segura de metadados, avaliações e contatos com filtros/status.
- Migração SQL com RLS e índices, limite de envios durável, integração Supabase e aviso opcional por Resend.
- `LegalService`, breadcrumbs, `Article` apenas em notícias revisadas, metadados por rota, sitemap, robots, ícone e imagem de compartilhamento.

## Evidências

| Verificação               | Resultado                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run lint`            | Sem erros ou avisos                                                                                      |
| `npm run build`           | Aprovado; todas as rotas compiladas                                                                      |
| `npm test`                | 49 testes aprovados                                                                                      |
| Migração/RLS              | Executada em Postgres local PGlite com identidades simuladas                                             |
| Fluxo no Edge             | Menu, 4 etapas, consentimento, WhatsApp, filtro, redirecionamento do painel e bloqueio de APIs aprovados |
| Responsividade            | 76 capturas, 19 rotas × 4 larguras (390/768/1440/1920); sem overflow horizontal                          |
| Acessibilidade automática | axe WCAG A/AA: zero violações nas 6 páginas verificadas                                                  |
| Dependências de produção  | `npm audit --omit=dev`: zero vulnerabilidades reportadas                                                 |

Scripts e evidências locais em `scripts/` e `qa/`. A revisão visual corrigiu sobreposição entre legenda da marca e o bloco de contato do hero. A verificação de movimento reduzido revelou uma divergência de hidratação, corrigida com uma leitura de preferência compatível com renderização no servidor.

Limites da verificação: o projeto Supabase remoto, o login real, as operações de publicação no banco remoto, Resend, DNS e GA4 não foram exercitados sem configuração. O resultado do axe não substitui uma auditoria humana completa. Lighthouse não foi executado; não há afirmação de nota 90+. O audit completo registra cinco alertas transitivos em ferramentas de lint, ligados a `braces`/`micromatch`/`fast-glob`; o registro consultado não forneceu correção compatível, e não foi aplicado downgrade do framework. Não afetam o relatório de dependências de produção.

## Suposições

- “Pavanello Advogados” e as 11 áreas propostas no briefing foram usados como identificação e estrutura provisórias.
- A captura do Instagram serviu apenas como referência de ambiente; não foi publicada, retocada nem apresentada como retrato original.
- Notícias demonstrativas são prévias editoriais identificadas, sem inventar fatos ou fontes. Aparecem somente em desenvolvimento.
- Dados ausentes não foram inventados. O formulário continua pelo WhatsApp enquanto não houver banco configurado.
- O site ficou local, com indexação desativada até a revisão exigida pelos arquivos fornecidos. Nenhum domínio, projeto remoto ou DNS foi alterado.

## Pendências

Nome oficial definitivo; nome da coordenadora; responsável e OAB; CNPJ/registro da sociedade, se aplicável; horário; áreas aprovadas; retrato e fotos originais; logo maior; textos expandidos de Maiara e Alessandra caso disponíveis; revisão jurídica e responsável/retenção de dados; credenciais Supabase e Resend opcional; publicação Vercel, DNS e Google Business. Maps, Instagram e as 12 avaliações já foram incorporados nesta revisão.

## Como rodar e o que testar

Execute `npm install` e `npm run dev`; abra http://localhost:3000. Instruções completas em [desenvolvimento.md](desenvolvimento.md).

Revise a home e as áreas no celular, faça um contato nas quatro etapas e confira a mensagem no WhatsApp. Depois de configurar o banco, entre em `/admin/login`, publique uma notícia revisada, confira sua página pública, despublique e verifique que desapareceu. Cadastre uma avaliação real autorizada. Envie um contato e confira a prioridade e a mudança de status no painel. Se ativar Resend, confirme a entrega do aviso. Só depois libere a indexação e faça a publicação conforme [publicacao.md](publicacao.md).
