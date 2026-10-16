import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.QA_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
await mkdir('qa', { recursive: true });
const routes = [
  '/',
  '/sobre',
  '/areas-de-atuacao',
  '/areas-de-atuacao/direito-trabalhista',
  '/areas-de-atuacao/direito-de-familia',
  '/areas-de-atuacao/inventario-e-sucessoes',
  '/areas-de-atuacao/direito-previdenciario',
  '/areas-de-atuacao/direito-do-consumidor',
  '/areas-de-atuacao/direito-civil',
  '/areas-de-atuacao/direito-imobiliario',
  '/areas-de-atuacao/direito-empresarial',
  '/areas-de-atuacao/agronegocio',
  '/areas-de-atuacao/direito-criminal',
  '/areas-de-atuacao/direito-tributario',
  '/noticias',
  '/contato',
  '/privacidade',
  '/aviso-legal',
  '/admin/login',
];
const results = [];
try {
  for (const width of [390, 768, 1440, 1920]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: 'reduce',
    });
    for (const route of routes) {
      const response = await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      const filename = `qa/${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}-${width}.png`;
      await page.screenshot({ path: filename, fullPage: true });
      results.push({
        route,
        width,
        status: response.status(),
        overflow,
        filename,
      });
      if (overflow || response.status() !== 200)
        console.error('FAIL', route, width, response.status(), overflow);
    }
    await page.close();
  }
  await writeFile('qa/screenshots.json', JSON.stringify(results, null, 2));
  console.log(`${results.length} capturas salvas em qa/.`);
  if (results.some((r) => r.overflow || r.status !== 200)) process.exitCode = 1;
} finally {
  await browser.close();
}
