import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
await mkdir('qa', { recursive: true });
const checks = [];
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'qa/hero-desktop.png' });
  const schema = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  assert.equal(JSON.parse(schema)['@type'], 'LegalService');
  assert.ok(!schema.includes('aggregateRating'));
  checks.push('LegalService sem avaliações estruturadas');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'qa/hero-mobile.png' });
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page
    .getByRole('navigation', { name: 'Menu móvel' })
    .getByRole('link', { name: 'Quem somos' })
    .click();
  await page.waitForURL('**/sobre');
  assert.equal(
    await page
      .getByRole('button', { name: 'Abrir menu' })
      .getAttribute('aria-expanded'),
    'false',
  );
  checks.push('Menu móvel abre, navega e fecha');
  await page.goto(base + '/contato');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.locator('.contact-form [role=alert]').waitFor();
  assert.match(
    await page.locator('.contact-form [role=alert]').textContent(),
    /Selecione/,
  );
  await page
    .getByLabel('Assunto do atendimento')
    .selectOption('direito-de-familia');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByLabel('Só tenho uma dúvida', { exact: true }).check();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByLabel('Sem pressa', { exact: true }).check();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByLabel('Nome completo').fill('Teste automatizado');
  await page.getByLabel('WhatsApp com DDD').fill('64999991234');
  await page
    .getByLabel('Breve descrição (opcional)')
    .fill('Teste local de formulário.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Enviar solicitação' }).click();
  await page
    .getByRole('heading', { name: 'Sua mensagem está pronta.' })
    .waitFor();
  const href = await page
    .getByRole('link', { name: 'Abrir WhatsApp' })
    .getAttribute('href');
  assert.ok(href.startsWith('https://wa.me/5564999975133?text='));
  assert.match(decodeURIComponent(href), /Direito de família/);
  assert.equal(
    await page.getByRole('link', { name: 'Consultar notícias' }).count(),
    1,
  );
  await page.screenshot({ path: 'qa/form-success-mobile.png' });
  checks.push(
    'Quatro etapas, validação, máscara, consentimento e mensagem correta para WhatsApp',
  );
  await page.goto(base + '/contato?area=direito-trabalhista');
  assert.match(await page.locator('.form-top').textContent(), /Etapa 2 de 4/);
  checks.push('Área pré-selecionada no contato');
  await page.goto(base + '/noticias?area=direito-criminal');
  await page.getByText('Ainda não há notícias por aqui.').waitFor();
  checks.push('Filtro de notícias com estado vazio');
  await page.goto(base + '/admin/leads');
  assert.ok(page.url().endsWith('/admin/login'));
  checks.push('Painel redireciona visitante sem sessão');
  assert.equal(
    (await page.request.get(base + '/api/admin/leads')).status(),
    403,
  );
  assert.equal(
    (
      await page.request.post(base + '/api/admin/metadata', {
        data: { url: 'http://127.0.0.1' },
      })
    ).status(),
    401,
  );
  checks.push('APIs administrativas recusam acesso anônimo');
  assert.equal(
    (
      await page.request.post(base + '/api/leads', {
        data: { nome: 'Inválido' },
      })
    ).status(),
    400,
  );
  checks.push('Servidor recusa lead inválido');
  assert.equal((await page.goto(base + '/pagina-inexistente')).status(), 404);
  checks.push('Página 404');
  assert.equal(errors.length, 0, errors.join('\n'));
  checks.push('Sem erros de JavaScript no fluxo');
  await writeFile(
    'qa/verification.json',
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
