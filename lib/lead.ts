import { z } from 'zod';
import { areas } from '@/content/areas';
export const momentos = {
  contratar_agora: 'Quero contratar um advogado agora',
  avaliando: 'Estou avaliando opções',
  so_duvida: 'Só tenho uma dúvida',
};
export const urgencias = {
  prazo_proximo: 'Tenho prazo ou audiência próxima',
  proximas_semanas: 'Preciso resolver nas próximas semanas',
  sem_pressa: 'Sem pressa',
};
export const leadSchema = z.object({
  nome: z.string().trim().min(3, 'Informe seu nome completo.').max(120),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => /^\d{10,11}$/.test(v), 'Informe um WhatsApp com DDD.'),
  cidade: z.string().trim().min(2, 'Informe sua cidade.').max(100),
  area: z
    .string()
    .refine(
      (v) => v === 'outro' || areas.some((a) => a.slug === v),
      'Escolha um assunto.',
    ),
  momento: z.enum(['contratar_agora', 'avaliando', 'so_duvida']),
  urgencia: z.enum(['prazo_proximo', 'proximas_semanas', 'sem_pressa']),
  descricao: z.string().trim().max(400, 'Use até 400 caracteres.').default(''),
  consentimento_lgpd: z.literal(true, {
    error: 'Autorize o contato para continuar.',
  }),
  website: z.string().max(0).default(''),
});
export type Lead = z.infer<typeof leadSchema>;
export function prioridadeLead(lead: Pick<Lead, 'momento' | 'urgencia'>) {
  if (lead.momento === 'contratar_agora' && lead.urgencia !== 'sem_pressa')
    return 'alta';
  if (
    lead.momento === 'so_duvida' ||
    (lead.momento === 'avaliando' && lead.urgencia === 'sem_pressa')
  )
    return 'baixa';
  return 'media';
}
export function mensagemLead(lead: Lead) {
  const area = areas.find((a) => a.slug === lead.area)?.nome || 'Outro assunto';
  return `Olá! Meu nome é ${lead.nome}, de ${lead.cidade}.\nAssunto: ${area}.\nMomento: ${momentos[lead.momento]}.\nUrgência: ${urgencias[lead.urgencia]}.${lead.descricao ? '\nBreve descrição: ' + lead.descricao : ''}`;
}
export function maskPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const cut = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, cut)}${d.length > cut ? '-' + d.slice(cut) : ''}`;
}
