# Pavanello Advogados — Site institucional

Site institucional e de captação de **leads qualificados** da Pavanello Advogados (Rio Verde, GO).
Esta pasta é o ponto de partida: briefing, design system, referências e prompts. O código do site é gerado a partir deles.

**Status:** site implementado em Next.js, com páginas públicas, formulário e integração preparada para painel Supabase. Para executar e configurar, veja [docs/desenvolvimento.md](docs/desenvolvimento.md). Permanecem pendentes fotos originais, dados profissionais, revisão jurídica e credenciais do banco. Os documentos de briefing e prompts abaixo foram preservados como referência.

## Objetivo

1. Aparecer bem no Google e no Google Maps em buscas como "advogado trabalhista em Rio Verde", "advogado de família" e "inventário".
2. Atrair quem quer contratar e filtrar curiosos, com um formulário em etapas que qualifica antes do contato.
3. Mostrar reputação: nota 5,0 e 247 avaliações no Google, em carrossel animado que troca as avaliações.
4. Ter uma aba de **Notícias** alimentada por painel: cola o link da matéria, o site monta o post com o comentário do escritório.
5. Institucional: Quem somos, áreas de atuação com especialistas e o espaço do escritório.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Next.js (App Router, versão estável mais recente) + TypeScript | SEO, páginas rápidas, uma rota por área de atuação |
| Estilo | Tailwind CSS com os tokens do `design-system.md` | Consistência de espaçamento, bordas e cores |
| Animação | Motion (pacote `motion`, antigo Framer Motion) | Carrossel de avaliações e entrada do hero |
| Banco e login | Supabase (Postgres + Auth) | Leads, notícias, avaliações e painel de notícias |
| Hospedagem | Vercel | Deploy a cada push, HTTPS automático |
| E-mail de aviso | Resend (opcional) | Avisar o escritório quando chegar um lead |

## Estrutura da pasta

```
pavanello-advocacia/
├── README.md                      este arquivo
├── AGENTS.md                      regras que o agente de código lê sozinho
├── briefing.md                    cliente, objetivo, tom de voz, conteúdo
├── design-system.md               cores, tipografia, espaço, componentes
├── .env.example                   variáveis de ambiente
├── prompts/
│   ├── 01-prompt-principal-site.md    constrói o site (front completo)
│   ├── 02-prompt-painel-e-leads.md    painel de notícias, avaliações e leads
│   └── 03-prompt-qa-visual.md         revisão visual por imagem
├── referencias/
│   ├── LEIA-ME.md                 o que colocar aqui
│   ├── logo.png
│   └── foto-coordenadora-instagram.jpeg
└── docs/
    └── publicacao.md              domínio, Google Meu Negócio, Search Console
```

Depois que o código for gerado, aparecem também `app/`, `components/`, `content/`, `lib/`, `public/` e `supabase/`.

## Como usar com o ChatGPT (passo a passo)

1. Abra esta pasta no ChatGPT/Codex, com raciocínio **alto** (ou extra alto para o prompt 01).
2. Coloque as fotos e arquivos pendentes em `referencias/` (veja `referencias/LEIA-ME.md`).
3. Envie: *"Leia AGENTS.md, README.md, briefing.md e design-system.md. Depois execute o prompt 01."* e cole o conteúdo de `prompts/01-prompt-principal-site.md`.
4. Rode `npm install` e `npm run dev` e abra `http://localhost:3000`.
5. Tire prints (390 px de celular e 1440 px de desktop) e use `prompts/03-prompt-qa-visual.md` para refinar. Repita até ficar como você quer.
6. Execute `prompts/02-prompt-painel-e-leads.md` (painel de notícias, avaliações e formulário com banco).
7. Rode o QA visual de novo nas telas novas.
8. Suba para o GitHub, conecte na Vercel e siga `docs/publicacao.md`.

Por que em três prompts e não um só: o modelo erra menos quando primeiro acerta o visual com dados de exemplo e só depois liga o banco.

## Pendências antes de publicar

- Nome da coordenadora e, se o escritório quiser, dos advogados, com número da OAB (o escritório decide o que aparece).
- Fotos do escritório e foto da coordenadora em arquivo original, sem texto sobre a imagem.
- Logo em vetor (SVG) ou PNG grande: o atual tem 331 × 264 px, pequeno para uso grande no hero.
- Horário de atendimento oficial (o Maps e a mensagem automática do WhatsApp divergem).
- Link do perfil no Google Maps e acesso do escritório ao Perfil da Empresa.
- Confirmar com o escritório as regras de publicidade da OAB para as avaliações (ver `briefing.md`, seção 9).
- Acesso ao painel de DNS da Web Mix.
