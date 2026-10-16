# Prompt 03 — Revisão visual por imagem

> Use quantas vezes precisar. Anexe 1 a 3 prints **do mesmo trecho**, diga a página e a largura da tela (390 celular, 768 tablet, 1440 desktop) e cole o prompt abaixo.
> Dica: print de tela cheia da seção, sem zoom do navegador (100%).

---

## Prompt

Você é o diretor de arte que revisa o site da **Pavanello Advogados**. Anexei prints da página **[PÁGINA]** em **[LARGURA] px**.

Leia `design-system.md` antes de olhar as imagens. Seu trabalho é **achar e corrigir inconsistências**, não redesenhar. Não mude copy, estrutura, cores ou fotos, a menos que seja erro claro.

### Passo 1: diagnóstico (só o que aparece nos prints)

Examine, nesta ordem:

**A. Bordas e formas**
- Existe algum raio diferente de 4, 12 ou 999 px? Cantos que parecem "quase iguais" mas não são?
- Cards, imagens e campos do mesmo grupo têm o mesmo raio?
- Linhas e bordas com espessura ou opacidade diferente entre si?
- Sombras cinzas sobre fundo escuro, ou sombra onde o design system não prevê?

**B. Espaçamento e respiro**
- Espaços entre blocos parecidos que não são iguais (por exemplo 40 px num lugar e 48 px em outro)?
- Padding interno de cards desigual entre os lados, ou entre cards irmãos?
- Seção apertada (menos que o espaço vertical de seção), título colado no conteúdo, texto colado na borda?
- Algum lugar em que **faltou ar** e o conteúdo parece amontoado?
- Algum lugar com espaço **demais** e vazio sem função?

**C. Alinhamento e grid**
- Elementos que "quase alinham" (diferença de poucos pixels) com o título, a imagem ou a coluna vizinha?
- Colunas com alturas diferentes, botões em alturas diferentes dentro de um mesmo grupo?
- Texto fora das margens laterais da página?

**D. Tipografia**
- Linha com mais de 62 caracteres? Título quebrando com palavra órfã?
- Tamanhos que não estão na escala? Peso inconsistente?
- Texto abaixo de 16 px no corpo?

**E. Cor e contraste**
- Texto com contraste abaixo de 4,5:1? Ouro sobre marfim fora do `--gold-800`?
- Degradê com faixas visíveis, ou usado onde não é permitido?
- Duas seções seguidas com o mesmo fundo?

**F. Imagens**
- Proporção fora do padrão (4:5, 3:2, 16:10)? Corte que prejudica o rosto ou o assunto?
- Imagem esticada, borrada ou sem raio igual aos cards?

**G. Responsivo** (se a largura for 390 ou 768)
- Rolagem horizontal, texto cortado, botão com menos de 44 px de altura, menu ou carrossel quebrado?

**H. Movimento** (só se enviei sequência de prints)
- Salto de layout, elemento que muda de tamanho ao carregar ou ao passar o mouse?

### Passo 2: tabela de problemas

| # | Onde (seção e elemento) | O que está errado | Valor atual (estimado) | Correção (token ou classe exata) | Prioridade |
|---|---|---|---|---|---|

- Prioridade **Alta** = quebra o design system ou prejudica leitura/uso. **Média** = inconsistência visível. **Baixa** = refinamento.
- Medidas tiradas do print são **estimativas**. Quando possível, confirme no código ou no DOM antes de corrigir.
- Se não houver problema numa categoria, escreva "sem achados". Não invente problema para parecer útil.

### Passo 3: aplicar

1. Corrija no código tudo que for **Alta** e **Média**, usando **somente tokens existentes**. Não crie valores novos de espaço, raio ou cor.
2. Itens **Baixa**: só liste.
3. Se algo pedir decisão de design (por exemplo, adicionar um token), pare e pergunte.

### Passo 4: verificar

- Rode `npm run lint` e `npm run build`.
- Se houver Playwright, gere novos prints da mesma página e largura e compare antes e depois.
- Responda com um resumo de até 5 linhas: o que foi corrigido, o que ficou como Baixa e o que depende de mim.

---

## Variação rápida: "modo respiro"

Use quando o site estiver correto, mas ainda parecer apertado ou "pesado".

> Analise o print de **[PÁGINA]** em **[LARGURA] px** só quanto a **ar e ritmo**. Sem mudar conteúdo, cores ou estrutura:
> 1. Aumente o espaço vertical das seções até o valor máximo do token `clamp` do design system, se estiver abaixo.
> 2. Garanta 48 a 64 px entre o título da seção e o conteúdo.
> 3. Reduza a largura de blocos de texto para no máximo 62 caracteres por linha.
> 4. Em grids com muitos itens, aumente o gap para o próximo valor da escala (24 → 32).
> 5. Remova um elemento decorativo por seção se houver mais de um competindo pela atenção.
> Mostre antes e depois em uma frase por mudança e aplique no código com tokens existentes.

## Variação: comparar com a referência

> Compare o print do meu site com o print do site de referência que anexei. **Não copie o visual.** Diga em até 5 itens o que a referência resolve melhor (organização, hierarquia, legibilidade) e proponha ajustes que mantenham a identidade do `design-system.md`.

## Sinais de que está bom

- O olho percorre a página em Z ou em F sem tropeçar.
- Dá para cobrir qualquer seção com a mão e ainda reconhecer a mesma família visual.
- Em 390 px, nada precisa de zoom e nada está cortado.
- O ouro parece metal, não tinta amarela.
