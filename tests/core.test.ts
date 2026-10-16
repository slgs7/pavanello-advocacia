import { describe, it, expect } from 'vitest';
import {
  leadSchema,
  prioridadeLead,
  maskPhone,
  mensagemLead,
} from '@/lib/lead';
import { slugify } from '@/lib/slug';
import { isPublicIp, validateUrl } from '@/lib/ip-security';
import { newsSchema } from '@/lib/admin-schemas';
const lead = {
  nome: 'Contato de teste',
  whatsapp: '(64) 99999-1234',
  cidade: 'Rio Verde',
  area: 'direito-trabalhista',
  momento: 'contratar_agora',
  urgencia: 'prazo_proximo',
  descricao: 'Teste de validação',
  consentimento_lgpd: true,
  website: '',
};
describe('qualificação e validação', () => {
  it('prioriza todos os nove cenários', () => {
    const expected = [
      ['alta', 'alta', 'media'],
      ['media', 'media', 'baixa'],
      ['baixa', 'baixa', 'baixa'],
    ];
    (['contratar_agora', 'avaliando', 'so_duvida'] as const).forEach(
      (momento, i) =>
        (['prazo_proximo', 'proximas_semanas', 'sem_pressa'] as const).forEach(
          (urgencia, j) =>
            expect(prioridadeLead({ momento, urgencia })).toBe(expected[i][j]),
        ),
    );
  });
  it('valida e normaliza telefone', () => {
    const parsed = leadSchema.parse(lead);
    expect(parsed.whatsapp).toBe('64999991234');
    expect(maskPhone(parsed.whatsapp)).toBe('(64) 99999-1234');
    expect(mensagemLead(parsed)).toContain('Direito trabalhista');
  });
  it.each([
    { consentimento_lgpd: false },
    { whatsapp: '123' },
    { website: 'robot' },
    { area: 'invalida' },
    { descricao: 'x'.repeat(401) },
    { nome: '' },
  ])('recusa campos inválidos %j', (bad) =>
    expect(leadSchema.safeParse({ ...lead, ...bad }).success).toBe(false),
  );
});
describe('URL e segurança de rede', () => {
  it.each([
    '127.0.0.1',
    '10.0.0.1',
    '172.16.0.1',
    '192.168.0.1',
    '169.254.169.254',
    '0.0.0.0',
    '::1',
    '::',
    '::ffff:127.0.0.1',
    'fc00::1',
    'fe80::1',
    '100.64.0.1',
    '224.0.0.1',
  ])('bloqueia %s', (ip) => expect(isPublicIp(ip)).toBe(false));
  it.each(['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111'])(
    'aceita IP público %s',
    (ip) => expect(isPublicIp(ip)).toBe(true),
  );
  it.each([
    'file:///etc/passwd',
    'http://127.0.0.1',
    'http://2130706433',
    'http://[::ffff:127.0.0.1]',
    'http://localhost',
    'https://example.com:8080',
    'https://user:pass@example.com',
  ])('recusa URL %s', (url) => expect(() => validateUrl(url)).toThrow());
  it('mantém HTTPS público', () =>
    expect(validateUrl('https://www.cnj.jus.br/noticias').hostname).toBe(
      'www.cnj.jus.br',
    ));
});
describe('publicação', () => {
  it('gera slug sem acentos', () =>
    expect(slugify('Família, sucessões & orientação!')).toBe(
      'familia-sucessoes-orientacao',
    ));
  it('impede publicação sem revisão', () =>
    expect(
      newsSchema.safeParse({
        titulo: 'Título de teste',
        fonte_nome: 'Fonte',
        fonte_url: 'https://example.com',
        resumo: 'Resumo de teste suficiente.',
        comentario: 'Comentário de teste suficiente.',
        area: '',
        status: 'publicado',
        revisado: false,
      }).success,
    ).toBe(false));
});
