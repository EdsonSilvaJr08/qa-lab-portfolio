/** Gera uma gravação REAL de uma jornada automatizada separada da suíte de regressão. */
import { chromium, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const baseURL = 'http://127.0.0.1:4173';
const output = resolve('assets/demo');
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ['server.js'], { stdio: 'inherit' });
let browser;
let context;

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt++) {
    try { if ((await fetch(baseURL)).ok) return; } catch { /* servidor ainda iniciando */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('Servidor de demonstração não iniciou em tempo hábil.');
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    recordVideo: { dir: resolve('assets/demo/.temporary'), size: { width: 1440, height: 900 } }
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.getByRole('heading', { name: 'Entre no seu espaço.' })).toBeVisible();
  await page.waitForTimeout(1100);
  await page.getByRole('button', { name: 'Preencher' }).click();
  await page.waitForTimeout(750);
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(page.getByTestId('stat-total')).toHaveText('3');
  await page.waitForTimeout(1100);
  await page.getByLabel('Título do chamado').fill('Demo gravada de automação QA');
  await page.getByLabel('Descrição').fill('Cenário demonstrativo executado automaticamente pelo Playwright.');
  await page.getByLabel('Prioridade').selectOption('high');
  await page.waitForTimeout(900);
  await page.getByRole('button', { name: 'Criar chamado' }).click();
  await expect(page.getByRole('heading', { name: 'Demo gravada de automação QA' })).toBeVisible();
  await expect(page.getByTestId('stat-total')).toHaveText('4');
  await page.waitForTimeout(900);
  await page.screenshot({ path: resolve(output, 'painel.png'), fullPage: true });
  await page.getByLabel('Buscar chamados').fill('Demo gravada');
  await expect(page.locator('.ticket-card')).toHaveCount(1);
  await page.waitForTimeout(900);
  const id = await page.locator('.ticket-card').first().getAttribute('data-ticket');
  if (!id) throw new Error('Código do chamado não encontrado');
  await page.getByLabel(`Alterar status do chamado ${id}`).selectOption('resolved');
  await expect(page.getByTestId('stat-resolved')).toHaveText('2');
  await page.waitForTimeout(1300);
  const recordedVideo = page.video();
  await context.close();
  context = null;
  if (!recordedVideo) throw new Error('Playwright não produziu vídeo');
  await copyFile(await recordedVideo.path(), resolve(output, 'automacao.webm'));
  console.log('Gravação real e screenshot publicados em assets/demo/');
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
