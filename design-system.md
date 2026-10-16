# Design System — Pavanello Advogados

Versão 1.3, revisada em 16/10/2026 conforme os ajustes solicitados pelo cliente. Fotos originais do escritório ainda pendentes.
As cores partem da logo (dourado metálico, de #B68013 a #FEEF9C, média #DBB857) e da foto de referência (mármore bege, madeira, estátua dourada).

## 1. Ideia de design

**Mármore e ouro, com luz por trás.** Fundos escuros quentes alternam com seções marfim (a cor do mármore do escritório). O ouro aparece só em detalhes: botão, linhas finas, números, ramos de louro. Uma única família sem serifa, Schibsted Grotesk, unifica títulos e interface, com espaço generoso entre os elementos.

## 2. Princípios

1. **Ar primeiro.** Na dúvida, mais espaço. Seções respiram, textos têm largura curta.
2. **Ouro é joia, não tinta.** Nunca em parágrafos, nunca como fundo de bloco grande, nunca em título inteiro.
3. **Uma coisa memorável.** Os ramos de louro da logo, grandes e recortados no hero, e a faixa de avaliações. O resto fica quieto.
4. **Poucas regras, sempre as mesmas.** 3 raios de borda, 1 escala de espaçamento, 1 grid. Nada de valor solto.
5. **Formal com leveza.** Seriedade na estrutura, calor na escrita.

## 3. Cores

```css
:root {
  /* Escuros (preto quente, puxado para o marrom do dourado) */
  --ink-950: #0c0a07; /* fundo base */
  --ink-900: #14100b; /* seções alternadas */
  --ink-800: #1d1710; /* superfícies e cards sobre escuro */
  --ink-700: #2a2218; /* hover de superfície, linhas fortes */

  /* Dourado (extraído da logo) */
  --gold-100: #feef9c; /* brilho da logo */
  --gold-300: #e9cb72;
  --gold-500: #dbb857; /* dourado médio da logo: texto e ícones sobre escuro */
  --gold-600: #b68013; /* sombra da logo */
  --gold-800: #7a5510; /* dourado escuro: texto e ícones sobre marfim */

  /* Marfim (mármore) */
  --ivory-50: #fbf8f1; /* superfície de card sobre marfim */
  --ivory-100: #f7f2e7; /* fundo de seção clara */
  --ivory-200: #ede5d3; /* divisórias e fundo alternado claro */

  /* Texto */
  --text-on-ink: #f2ebdc; /* corpo sobre escuro */
  --text-on-ink-muted: #b7ad97; /* secundário sobre escuro */
  --text-on-ivory: #17120b; /* corpo sobre marfim */
  --text-on-ivory-muted: #5b5242;

  /* Estados */
  --success: #7fbf9a;
  --error: #e58b7b; /* sobre escuro; sobre marfim usar #A63D2F */

  /* Linhas */
  --line-on-ink: rgba(219, 184, 87, 0.22);
  --line-on-ivory: rgba(122, 85, 16, 0.25);
}
```

**Degradês (único lugar onde são permitidos):**

```css
--grad-gold: linear-gradient(
  135deg,
  #feef9c 0%,
  #dbb857 38%,
  #b68013 72%,
  #8a5f0e 100%
); /* metal, como a logo */
--grad-gold-line: linear-gradient(
  90deg,
  transparent,
  #dbb857 50%,
  transparent
); /* fio fino */
--grad-ink: radial-gradient(
  120% 90% at 85% 0%,
  #2b1f0c 0%,
  #14100b 45%,
  #0c0a07 100%
); /* fundo do hero e do contato */
--grad-ivory: linear-gradient(
  180deg,
  #f7f2e7 0%,
  #ede5d3 100%
); /* fundo das seções claras (sutil) */
```

Onde usar `--grad-gold`: fundo do botão principal, números grandes (5,0 e 247), fios finos, ornamento de louro. **Não usar** em texto corrido, em título inteiro nem em card grande.
Evitar faixas visíveis no degradê escuro: se aparecerem, somar ruído fino (cerca de 3%) por cima.

**Contraste (AA):** `--text-on-ink` sobre `--ink-950` e `--gold-500` sobre `--ink-950` passam com folga. Sobre marfim, ouro só com `--gold-800`. Validar todo par novo: 4,5:1 para texto normal, 3:1 para texto grande e ícones.

## 4. Tipografia

| Papel             | Família                              | Pesos         | Observação                                              |
| ----------------- | ------------------------------------ | ------------- | ------------------------------------------------------- |
| Títulos           | **Schibsted Grotesk** (Google Fonts) | 500, 600      | mesma família do corpo, diferenciada por tamanho e peso |
| Texto e interface | **Schibsted Grotesk** (Google Fonts) | 400, 500, 600 | grotesca legível e discreta                             |

Carregar uma única família com `next/font/google`, `display: swap`. Fallback: `system-ui, sans-serif`. `--font-heading` referencia `--font-body`. Tracking: hero -0.05em; h1/h2 -0.045em; h3 -0.025em.

| Token     | Tamanho                           | Altura de linha | Espaçamento entre letras | Uso                     |
| --------- | --------------------------------- | --------------- | ------------------------ | ----------------------- |
| `display` | `clamp(2.75rem, 6vw, 5rem)`       | 1.04            | -0.02em                  | H1 da home              |
| `h1`      | `clamp(2.25rem, 4.6vw, 3.75rem)`  | 1.08            | -0.015em                 | H1 das páginas internas |
| `h2`      | `clamp(1.875rem, 3.4vw, 3rem)`    | 1.12            | -0.01em                  | títulos de seção        |
| `h3`      | `clamp(1.25rem, 1.8vw, 1.625rem)` | 1.25            | 0                        | títulos de card e linha |
| `body-lg` | 1.1875rem                         | 1.65            | 0                        | subtítulo, lead         |
| `body`    | 1.0625rem                         | 1.65            | 0                        | texto corrido           |
| `small`   | 0.875rem                          | 1.5             | 0                        | fonte, data, legenda    |

Regras:

- Corpo com 16 px no mínimo. Linha com no máximo **62 caracteres** (`max-width: 62ch`).
- Alinhamento à esquerda por padrão. Centralizar só blocos curtos de chamada. Nunca justificar.
- Títulos em **uma cor só**. Nada de destacar uma palavra do título em dourado ou itálico.
- Rótulos e links em _sentence case_. Sem TUDO EM MAIÚSCULAS, sem rótulo pequeno em cima de todo título, sem setas "→" no fim de botão ou link.
- Números grandes em Schibsted Grotesk 500; ouro sobre fundo escuro, tinta sobre marfim.

## 5. Espaçamento

Escala única (múltiplos de 4): `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160` px.

| Onde                       | Valor                                        |
| -------------------------- | -------------------------------------------- |
| Espaço vertical de seção   | `clamp(80px, 10vw, 144px)` em cima e embaixo |
| Título de seção → conteúdo | 48 px (64 px a partir de 1024 px)            |
| Título → parágrafo         | 16 px (24 px em `h2`)                        |
| Parágrafo → parágrafo      | 16 px                                        |
| Padding de card            | 24 px no celular, 32 px a partir de 768 px   |
| Espaço entre itens de grid | 24 px (32 px a partir de 1024 px)            |
| Margem lateral da página   | `clamp(20px, 5vw, 48px)`                     |

Proibido: valores como 13, 18, 22, 37 px. Se não está na escala, não entra.

## 6. Grid e layout

- Contêiner: `max-width: 1200px`. Largo (hero e galeria): `1360px`.
- Grid de 12 colunas a partir de 1024 px; 4 colunas no celular.
- Breakpoints: 640 · 768 · 1024 · 1280 · 1536.
- Tudo alinhado ao grid: o texto do hero e o título da seção seguinte começam na mesma linha vertical.
- Alternância de seções: **escuro, marfim, escuro, marfim**. Nunca duas iguais coladas.

Esboço da home:

```
┌ header  logo · Áreas · Quem somos · Notícias · Contato · [IG] [WA] ┐
│ HERO (escuro)       H1 + texto + 2 botões     | retrato (4:5)       │
│                     chip: 5,0 ★★★★★ 247 avaliações no Google       │
├─ ÁREAS (marfim)     timeline, cartões e links para os assuntos ─────┤
├─ COMO ATENDEMOS (escuro)  quatro painéis com números e convite ─────┤
├─ O ESCRITÓRIO (marfim)   galeria com espaços de imagem vazios ──────┤
├─ CONTATO (escuro)   formulário em etapas + endereço e horário ──────┤
├─ AVALIAÇÕES (marfim) cartões em leque, sem numeração ───────────────┤
├─ LOCALIZAÇÃO (escuro) endereço e mapa Google ──────────────────────┤
├─ NOTÍCIAS (marfim) última seção antes do rodapé ───────────────────┤
└ footer (ink-950) ───────────────────────────────────────────────────┘
```

## 7. Bordas, linhas e sombras

Somente **três raios**:

| Token           | Valor | Uso                                    |
| --------------- | ----- | -------------------------------------- |
| `--radius-sm`   | 4px   | detalhes pequenos (etiquetas internas) |
| `--radius-md`   | 12px  | cards, imagens, campos de formulário   |
| `--radius-pill` | 999px | botões e chips                         |

- Linha padrão: 1px com `--line-on-ink` ou `--line-on-ivory`. Nada de borda de 2 px ou de cor chapada brilhante.
- Hover de card: a linha fica mais forte (opacidade 0,5). Sem `scale`, sem pulo.
- Sombra: **só sobre marfim**, quente e baixa: `0 1px 0 rgba(60,40,10,.04), 0 16px 32px -20px rgba(60,40,10,.28)`. Sobre escuro, separar por linha e por tom de superfície, nunca por sombra cinza.
- Foco de teclado: contorno de 2px em `--gold-500` com 3px de distância. Sempre visível.
- Uma imagem tem sempre o mesmo raio dos cards (`--radius-md`) e proporção fixa: retrato 4:5, galeria 3:2, notícia 16:10.

## 8. Componentes

**Botão principal.** Altura 48 px (toque mínimo 44), padding lateral 24 px, `--radius-pill`, fundo `--grad-gold`, texto `--ink-950` peso 600. Hover: brilho leve. Na hero, elevação de 2px, camada `--gold-100` a 18% e sombra estática `0 8px 32px` com `--gold-500` a 28%, reveladas por opacidade em 300ms. Secundário da hero: preenchimento com `--grad-gold` por `scaleY` de baixo para cima em 350ms, com troca de camadas de texto para preto por opacidade. Toque: escala 0,97 em 100ms. Hover só com `(hover: hover) and (pointer: fine)`; foco mantém contorno visível.
**Botão secundário.** Mesma forma, fundo transparente, linha de 1px em `--gold-500` (sobre marfim, `--gold-800`).
**Link de texto.** Sublinhado com `text-underline-offset: 4px`, espessura 1px; no hover, 2px.

**Cabeçalho.** 72 px de altura (64 no celular). Sobre o hero é transparente; ao rolar vira `--ink-950` a 90% com linha embaixo. Navegação: Áreas de atuação, Quem somos, Notícias, Contato e os ícones circulares de Instagram e WhatsApp. No celular, menu em gaveta.

**Áreas de atuação e temas.** Timeline adaptada do `TimelineBlock01` enviado pelo cliente. Moldura com linha de 1px, eixo vertical dourado e marcadores discretos. Título à esquerda e cartão marfim à direita no desktop; título e explicação empilhados no celular. Cartões com `--radius-md`, padding `--s8` no desktop e `--s6` no celular. Na home, chips com `--radius-pill` levam diretamente aos assuntos da página interna. Sem datas ou numeração fictícias. A linha acompanha a rolagem com Motion, e os cartões em leitura recebem borda `--gold-800` e `--shadow`. Deslocamento máximo de 12px em 650ms, desativado com preferência por movimento reduzido.

**Avaliações.** Fundo marfim e cartões `--ivory-50` em leque, adaptados do componente fornecido pelo cliente. Texto em `body`, autor em peso 600, estrelas `--gold-800`. Sete posições visíveis com destaque central, sem números. Botão para leitura ampliada em diálogo. Controles anterior e próxima; leitura estática opcional. Selo 5,0/247 vinculado ao perfil conferido. Tokens: `--fan-card-width: 384px`, `--fan-card-height: 432px`, `--fan-stage-height: 640px`; abaixo de 768px, largura `min(82vw,352px)`, altura 416px e palco 544px. Posições e escalas seguem a geometria do componente de referência.

**Filtro de notícias.** Combobox marfim, linha e ícones dourado escuro, opções selecionadas identificadas por marca. Lista rolável com `--select-max-height: 320px`, navegação por teclado e fechamento por Escape ou clique externo.

**Como atendemos.** São 4 passos em sequência real (você conta o caso, triagem com o advogado da área, análise e reunião, acompanhamento). Aqui a numeração é permitida.

**O escritório.** Galeria 3:2 com `ImageSlot`: painel `--ink-800`, linha `--line-on-ink`, ramo de louro a 15% de opacidade ao centro. Em produção, se não houver fotos configuradas, a seção não aparece.

**Notícias.** Primeiro item grande (ocupa 2 colunas), dois menores ao lado. Cada um: imagem 16:10, fonte e data em `small`, título em `h3` (até 3 linhas), resumo (até 2 linhas) e link "Ler comentário do escritório". Sem imagem, usar fundo `--ink-800` com louro.

**Formulário em etapas.** Barra de progresso fina em `--gold-500` (sem bolinhas numeradas). Opções como lista de seleção com linha e raio `--radius-md`; campos com label acima; erro em texto claro com ícone, na cor `--error`. Botões "Voltar" (secundário) e "Continuar" (principal). Na confirmação: mensagem humana e botão "Abrir WhatsApp" com a mensagem pronta.

**Rodapé.** `--ink-950`. Nome, endereço, telefone, e-mail, horário, links, texto do Provimento 205/2021 e identificação da OAB.

## 9. Movimento

- **Um momento orquestrado**: entrada da hero com GSAP, valores em `lib/hero-motion.ts`. Marca em escala 0,92 → 1 e fade por 1,2s (`power3.out`); no celular, 0,9s. Desfoque visual com cópia decorativa de blur estático de 8px, revelando a marca nítida por opacidade. Tag, linhas naturais do título (30px), subtítulo, botões e nota entram em stagger de 0,12s (0,08s no celular). Card entra de 40px com delay de 0,3s; balão por último com `back.out(1.6)`. As linhas se recalculam após carregar a fonte ou mudar a largura, preservando o texto para leitores de tela. `will-change` é removido ao terminar entrada e scrub. HTML inicial visível; classe `js` só ativa o estado inicial após a inicialização da animação. Ícones sociais do cabeçalho da home: escala 1,08 e rotação 4° no hover; toque 0,97.
- O carrossel em leque usa GSAP, transições de 1150ms com `power2.inOut` e intervalo de 5 segundos. A entrada e a saída seguem as bordas do leque. Pausa com mouse, foco ou diálogo; não avança fora da tela nem em aba oculta. Não há botão central de pausa. A opção “Ler todas sem movimento” permite leitura estática.
- Respostas ao toque (abrir menu, passar etapa, enviar formulário) animam em 200 ms.
- Sem "sobe e aparece" em toda seção, sem hover animado em todo card. Exceção solicitada para a hero: GSAP + ScrollTrigger; conteúdo sobe até 80px, card 120px e louro 30px, com scrub 0,6 e opacidade final 0,3 apenas no texto. No celular, amplitudes pela metade. Sem fixar a seção ou alterar seu espaço no layout.
- `prefers-reduced-motion: reduce`: sem animação; o carrossel vira uma lista estática com botão "Ver mais avaliações".

## 10. Imagens

- Retrato da coordenadora: luz quente, sem filtro pesado, proporção 4:5, no hero e em Quem somos.
- Nada de banco de imagens de martelo, balança, aperto de mão ou prédio de vidro.
- Fotos de notícia: miniatura com crédito da fonte. Se faltar, usar o fundo de louro.
- Todas com `alt` descritivo e `sizes` corretos. Imagem do hero com `priority`.

## 11. O que evita o visual "genérico de IA"

- Cartões idênticos repetidos em tudo, todos com o mesmo raio e a mesma sombra cinza.
- Rótulo em maiúsculas minúsculo acima de cada título.
- Numeração 01/02/03 onde não existe sequência.
- Destacar uma palavra do título com cor ou itálico.
- Degradê como "banho" decorativo em qualquer bloco.
- Seta "→" ao fim de cada link.
- Fade-in com deslizamento em todas as seções.
- Ícone dentro de círculo colorido em cada item.

## 12. Checklist de aceite visual

- [ ] Só existem os raios 4, 12 e 999.
- [ ] Todo espaço está na escala de 4.
- [ ] Textos com no máximo 62 caracteres por linha.
- [ ] Nenhum elemento "quase alinhado": tudo encosta no grid.
- [ ] Seções alternam escuro e marfim.
- [ ] Ouro só em botão, fios, números, louro e ícones.
- [ ] Contraste AA em todos os pares de cor.
- [ ] Imagens com proporção fixa e mesmo raio.
- [ ] Sem rolagem horizontal em 390 px.
- [ ] Alvos de toque de 44 px ou mais.
- [ ] Hero legível e bonito em 390, 768, 1440 e 1920 px.
