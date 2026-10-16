import 'server-only';
import { lookup } from 'node:dns/promises';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { load } from 'cheerio';
import { isPublicIp, validateUrl } from './ip-security';
// Pin the validated DNS address on the socket; validating before a plain fetch allows DNS rebinding.
export async function fetchMetadata(input: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    let url = validateUrl(input);
    for (let hop = 0; hop <= 3; hop++) {
      controller.signal.throwIfAborted();
      const addresses = await Promise.race([
        lookup(url.hostname.replace(/^\[|\]$/g, ''), { all: true }),
        new Promise<never>((_, reject) =>
          controller.signal.addEventListener(
            'abort',
            () => reject(new Error('Tempo de busca esgotado.')),
            { once: true },
          ),
        ),
      ]);
      if (!addresses.length || addresses.some((a) => !isPublicIp(a.address)))
        throw new Error('Endereço privado não permitido.');
      const chosen = addresses[0];
      const result = await new Promise<{ html?: string; location?: string }>(
        (resolve, reject) => {
          const req = (url.protocol === 'https:' ? httpsRequest : httpRequest)(
            url,
            {
              signal: controller.signal,
              headers: {
                'User-Agent': 'PavanelloMetadata/1.0',
                Accept: 'text/html',
                'Accept-Encoding': 'identity',
              },
              lookup: (_hostname, options, callback) => {
                if (options.all) callback(null, [chosen]);
                else callback(null, chosen.address, chosen.family);
              },
            },
            (res) => {
              if ([301, 302, 303, 307, 308].includes(res.statusCode || 0)) {
                res.resume();
                resolve({ location: res.headers.location });
                return;
              }
              if (
                res.statusCode !== 200 ||
                !res.headers['content-type']
                  ?.toLowerCase()
                  .startsWith('text/html')
              ) {
                res.destroy();
                reject(new Error('A fonte não retornou uma página HTML.'));
                return;
              }
              let size = 0;
              const chunks: Buffer[] = [];
              res.on('data', (chunk: Buffer) => {
                size += chunk.length;
                if (size > 1024 * 1024) {
                  res.destroy();
                  reject(new Error('A página excede o tamanho permitido.'));
                } else chunks.push(chunk);
              });
              res.on('end', () =>
                resolve({ html: Buffer.concat(chunks).toString('utf8') }),
              );
              res.on('error', reject);
            },
          );
          req.on('error', reject);
          req.end();
        },
      );
      if (result.location) {
        if (hop === 3) throw new Error('Muitos redirecionamentos.');
        url = validateUrl(new URL(result.location, url).href);
        continue;
      }
      if (!result.html) throw new Error('Página indisponível.');
      const $ = load(result.html);
      const meta = (name: string) =>
        $(`meta[property="${name}"]`).attr('content') || '';
      const image = meta('og:image');
      let imageUrl = '';
      try {
        if (image) imageUrl = validateUrl(new URL(image, url).href).href;
      } catch {}
      return {
        titulo: (meta('og:title') || $('title').text()).slice(0, 200),
        resumo: (
          meta('og:description') ||
          $('meta[name="description"]').attr('content') ||
          ''
        ).slice(0, 320),
        fonte_nome: (meta('og:site_name') || url.hostname).slice(0, 120),
        fonte_url: url.href,
        imagem_url: imageUrl,
        imagem_credito: meta('og:site_name') || url.hostname,
      };
    }
    throw new Error('Não foi possível buscar os dados.');
  } finally {
    clearTimeout(timer);
  }
}
