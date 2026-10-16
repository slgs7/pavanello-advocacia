export const siteConfig = {
  name: 'Pavanello Advogados',
  city: 'Rio Verde',
  state: 'GO',
  address: 'Av. Pres. Vargas, 2423, Jardim Goiás, Rio Verde, GO, 75903-290',
  street: 'Av. Pres. Vargas, 2423, Jardim Goiás',
  postalCode: '75903-290',
  phone: '(64) 99997-5133',
  phoneDigits: '5564999975133',
  email: 'advogados@pavanelloepavanello.adv.br',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelloepavanello.adv.br',
  mapsUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
    'https://www.google.com/maps/place/Pavanello+Advogados/@-17.7871208,-50.9156189,17z/data=!4m6!3m5!1s0x9361db0f81fdc793:0xaadeb79e3fc551a2!8m2!3d-17.7871208!4d-50.9156189!16s%2Fg%2F11k5056tq6',
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=Pavanello%20Advogados%2C%20Av.%20Pres.%20Vargas%2C%202423%2C%20Rio%20Verde&z=16&output=embed',
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    'https://www.instagram.com/pavanelloadvogados/',
  hours: '',
  coordinator: '',
  oab: '',
  rating: '5,0',
  reviewCount: 247,
  reviewsApproved: process.env.NEXT_PUBLIC_REVIEWS_APPROVED !== 'false',
  disclaimer:
    'Este site tem caráter exclusivamente informativo, em conformidade com o Código de Ética e Disciplina da OAB e o Provimento 205/2021 do CFOAB. O conteúdo não constitui promessa de resultado nem aconselhamento jurídico. Cada caso exige análise individual.',
};
export const isDevelopment = process.env.NODE_ENV === 'development';
export function whatsappUrl(
  message = 'Olá! Gostaria de conversar com a equipe sobre um atendimento.',
) {
  return `https://wa.me/${siteConfig.phoneDigits}?text=${encodeURIComponent(message)}`;
}
