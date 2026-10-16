import { z } from 'zod';
const safeUrl = z
  .string()
  .url()
  .refine(
    (value) => ['http:', 'https:'].includes(new URL(value).protocol),
    'Use um link HTTP ou HTTPS.',
  );
export const newsSchema = z
  .object({
    titulo: z.string().trim().min(5).max(200),
    fonte_nome: z.string().trim().min(2).max(120),
    fonte_url: safeUrl,
    imagem_url: z.union([safeUrl, z.literal('')]).optional(),
    imagem_credito: z.string().max(200).optional(),
    imagem_autorizada: z.boolean().default(false),
    resumo: z.string().trim().min(10).max(320),
    comentario: z.string().trim().min(10).max(15000),
    area: z.string().max(100),
    status: z.enum(['rascunho', 'publicado']),
    revisado: z.boolean(),
  })
  .refine((n) => n.status !== 'publicado' || n.revisado, {
    message: 'Confirme a revisão por advogado antes de publicar.',
  });
export const reviewSchema = z.object({
  autor: z.string().trim().min(2).max(120),
  texto: z.string().min(5).max(10000),
  nota: z.number().int().min(1).max(5),
  origem: z.literal('Google Maps'),
  quando: z.string().max(120).optional(),
  url: z.union([safeUrl, z.literal('')]).optional(),
  ativo: z.boolean(),
});
export const statusSchema = z.object({
  status: z.enum(['novo', 'em_contato', 'fechado', 'descartado']),
});
