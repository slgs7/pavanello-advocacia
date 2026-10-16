import { beforeEach, describe, it, expect, vi } from 'vitest';
import { EventEmitter } from 'node:events';
const network = vi.hoisted(() => ({
  responses: [] as {
    status: number;
    headers: Record<string, string>;
    body: string;
  }[],
  hosts: [] as string[],
  lookups: [] as unknown[],
}));
vi.mock('server-only', () => ({}));
vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(async (host: string) => {
    network.hosts.push(host);
    return [
      {
        address: host === 'internal.example' ? '127.0.0.1' : '93.184.216.34',
        family: 4,
      },
    ];
  }),
}));
vi.mock('node:https', () => ({
  request: vi.fn(
    (
      _url: URL,
      options: Record<string, unknown>,
      callback: (res: EventEmitter) => void,
    ) => {
      network.lookups.push(options.lookup);
      const request = new EventEmitter() as EventEmitter & { end: () => void };
      request.end = () => {
        const input = network.responses.shift();
        if (!input) {
          request.emit('error', new Error('Missing fixture'));
          return;
        }
        const res = Object.assign(new EventEmitter(), {
          statusCode: input.status,
          headers: input.headers,
          resume() {},
          destroy() {},
        });
        callback(res);
        res.emit('data', Buffer.from(input.body));
        res.emit('end');
      };
      return request;
    },
  ),
}));
vi.mock('node:http', async () => ({
  request: (await import('node:https')).request,
}));
import { fetchMetadata } from '@/lib/fetch-metadata';
beforeEach(() => {
  network.responses = [];
  network.hosts = [];
  network.lookups = [];
});
describe('busca segura de notícias', () => {
  it('extrai somente metadados e fixa o IP validado na conexão', async () => {
    network.responses.push({
      status: 200,
      headers: { 'content-type': 'text/html' },
      body: '<title>Notícia</title><meta property="og:description" content="Resumo"><meta property="og:image" content="/imagem.jpg"><meta property="og:site_name" content="Fonte">',
    });
    const result = await fetchMetadata('https://news.example/item');
    expect(result.titulo).toBe('Notícia');
    expect(result.imagem_url).toBe('https://news.example/imagem.jpg');
    const callback = vi.fn();
    (
      network.lookups[0] as (
        _host: string,
        options: object,
        cb: unknown,
      ) => void
    )('news.example', { all: true }, callback);
    expect(callback).toHaveBeenCalledWith(null, [
      { address: '93.184.216.34', family: 4 },
    ]);
  });
  it('bloqueia resolução DNS privada', async () => {
    await expect(fetchMetadata('https://internal.example')).rejects.toThrow(
      'privado',
    );
    expect(network.lookups).toHaveLength(0);
  });
  it('valida DNS novamente após redirecionamento', async () => {
    network.responses.push({
      status: 302,
      headers: { location: 'https://internal.example' },
      body: '',
    });
    await expect(fetchMetadata('https://news.example')).rejects.toThrow(
      'privado',
    );
    expect(network.hosts).toEqual(['news.example', 'internal.example']);
  });
  it('limita redirecionamentos a três', async () => {
    network.responses = Array.from({ length: 4 }, () => ({
      status: 302,
      headers: { location: '/redirect' },
      body: '',
    }));
    await expect(fetchMetadata('https://news.example')).rejects.toThrow(
      'redirecionamentos',
    );
    expect(network.lookups).toHaveLength(4);
  });
  it('limita a leitura a 1 MB', async () => {
    network.responses.push({
      status: 200,
      headers: { 'content-type': 'text/html' },
      body: 'a'.repeat(1024 * 1024 + 1),
    });
    await expect(fetchMetadata('https://news.example')).rejects.toThrow(
      'tamanho',
    );
  });
  it('recusa respostas sem HTML', async () => {
    network.responses.push({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
    await expect(fetchMetadata('https://news.example')).rejects.toThrow('HTML');
  });
});
