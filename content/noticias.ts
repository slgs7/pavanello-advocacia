export type Noticia = {
  id: string;
  slug: string;
  titulo: string;
  fonte_nome: string;
  fonte_url: string;
  imagem_url?: string;
  imagem_credito?: string;
  imagem_autorizada?: boolean;
  resumo: string;
  comentario: string;
  area: string;
  status: 'rascunho' | 'publicado';
  revisado: boolean;
  publicado_em: string | null;
  exemplo?: boolean;
};
export const noticias: Noticia[] = [
  {
    id: 'previa-trabalho',
    slug: 'previa-direito-do-trabalho',
    titulo: 'Direito do trabalho: informação para o seu dia a dia',
    fonte_nome: 'Prévia editorial',
    fonte_url: '',
    resumo:
      'Espaço reservado para notícias sobre relações de trabalho, com fonte e comentário do escritório.',
    comentario:
      'Esta é uma demonstração do formato de notícia. O conteúdo definitivo será cadastrado pela equipe, com o link da fonte e revisão de um advogado.',
    area: 'direito-trabalhista',
    status: 'rascunho',
    revisado: false,
    publicado_em: null,
    exemplo: true,
  },
  {
    id: 'previa-familia',
    slug: 'previa-familia-e-sucessoes',
    titulo: 'Família e sucessões: acompanhe as novidades',
    fonte_nome: 'Prévia editorial',
    fonte_url: '',
    resumo:
      'Uma seleção de notícias para ajudar você a acompanhar os assuntos que importam.',
    comentario:
      'Espaço demonstrativo. Nenhuma notícia externa foi reproduzida. A equipe poderá publicar um resumo com crédito e seu próprio comentário após a revisão.',
    area: 'direito-de-familia',
    status: 'rascunho',
    revisado: false,
    publicado_em: null,
    exemplo: true,
  },
  {
    id: 'previa-agro',
    slug: 'previa-agronegocio',
    titulo: 'O cenário jurídico de quem vive e produz no campo',
    fonte_nome: 'Prévia editorial',
    fonte_url: '',
    resumo:
      'Notícias do agronegócio e seus reflexos na nossa região, com contexto jurídico.',
    comentario:
      'Espaço reservado para conteúdo selecionado e revisado pelo escritório. A notícia original terá fonte e link preservados.',
    area: 'agronegocio',
    status: 'rascunho',
    revisado: false,
    publicado_em: null,
    exemplo: true,
  },
];
