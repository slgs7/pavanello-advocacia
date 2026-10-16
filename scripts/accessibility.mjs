import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  for (const path of [
    '/',
    '/contato',
    '/sobre',
    '/areas-de-atuacao/direito-de-familia',
    '/noticias',
    '/admin/login',
  ]) {
    await page.goto('http://127.0.0.1:3000' + path);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    results.push({
      path,
      violations: result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
  }
  await writeFile('qa/accessibility.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some((r) => r.violations.length)) process.exitCode = 1;
} finally {
  await browser.close();
}
