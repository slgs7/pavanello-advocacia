# Publicação: domínio, Google e medição

## 1. Domínio (Web Mix → Vercel)

O domínio `pavanelloepavanello.adv.br` e o e-mail ficam na Web Mix, pagos anualmente. Não precisa migrar nada.

1. Na Vercel: Project → Settings → Domains → adicionar `pavanelloepavanello.adv.br` e `www.pavanelloepavanello.adv.br`.
2. A Vercel mostra os registros DNS. Use os valores que ela mostrar.
3. No painel de DNS da Web Mix, altere **só** o registro A do domínio raiz e o CNAME do `www`.
4. **Não troque os nameservers** e **não apague** registros MX, SPF (TXT) ou DKIM: são eles que fazem o e-mail `advogados@...` funcionar.
5. Se o painel da Web Mix não permitir editar o DNS, peça ao suporte deles.
6. Aguarde a propagação (de minutos até 48 h). O HTTPS é emitido sozinho pela Vercel.

## 2. Perfil da Empresa no Google (onde o Maps se resolve)

Hoje o perfil mostra "Adicionar website" e o botão aponta para `wa.me`. Isso se resolve no perfil, não no código do site.

1. Quem é dono do perfil (a coordenadora) entra em business.google.com.
2. Editar perfil → Site → `https://pavanelloepavanello.adv.br`.
3. Categoria principal "Escritório de advocacia"; categorias secundárias conforme as áreas. Conferir se o horário é o mesmo do site.
4. Nome, endereço e telefone **idênticos** aos do site.

Duas expectativas honestas para alinhar com o cliente:

- Ao clicar no nome no Maps abre o perfil; o site fica no botão "Site". O Google não deixa pular o perfil.
- Ficar sempre no topo não é garantido. O Google pondera relevância, distância e proeminência (avaliações, site, citações). O site ajuda em relevância e proeminência; as 247 avaliações 5,0 já são um ativo forte.

## 3. Search Console e medição

1. Search Console → adicionar propriedade de **Domínio** → o Google pede um registro TXT no DNS da Web Mix.
2. Enviar `https://pavanelloepavanello.adv.br/sitemap.xml`.
3. GA4: eventos `whatsapp_click` e `lead_submit` (com `area` e `momento`). Carregar só após consentimento (banner de cookies).
4. Depois de 2 a 4 semanas, ver quais buscas trazem visitas e quais áreas convertem.

## 4. Checklist de lançamento

- [ ] Lighthouse no celular: desempenho, acessibilidade, SEO e boas práticas acima de 90 na home
- [ ] Teste de resultados avançados do Google no JSON-LD (`LegalService`)
- [ ] Formulário envia, salva no banco e abre o WhatsApp com a mensagem pronta
- [ ] E-mail de aviso de lead chega
- [ ] Painel de notícias: colar link, buscar dados, publicar, ver na vitrine
- [ ] Todos os textos jurídicos revisados por advogado (`revisado: true`)
- [ ] Rodapé com texto do Provimento 205/2021 e dados corretos
- [ ] Nome, endereço e telefone iguais ao Perfil da Empresa
- [ ] Política de privacidade (LGPD) com responsável definido
