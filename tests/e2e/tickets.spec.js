import { test, expect } from '@playwright/test';

async function demoLogin(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Preencher' }).click();
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(page.getByRole('heading', { name: /Olá, Alex/ })).toBeVisible();
}

test('CT-06: valida título, descrição e prioridade antes de criar chamado', async ({ page }) => {
  await demoLogin(page);
  await page.getByRole('button', { name: 'Criar chamado' }).click();
  await expect(page.locator('#title-error')).toContainText('5 e 80');
  await expect(page.locator('#description-error')).toContainText('10 a 500');
  await expect(page.locator('#priority-error')).toContainText('prioridade');
  await expect(page.getByTestId('stat-total')).toHaveText('3');
});

test('CT-07: cria chamado, atualiza indicadores e persiste após recarregar', async ({ page }) => {
  await demoLogin(page);
  await page.getByLabel('Título do chamado').fill('Falha ao carregar dashboard');
  await page.getByLabel('Descrição').fill('Ao acessar o painel de controle a lista fica vazia inesperadamente.');
  await page.getByLabel('Prioridade').selectOption('high');
  await page.getByRole('button', { name: 'Criar chamado' }).click();
  await expect(page.getByTestId('stat-total')).toHaveText('4');
  await expect(page.getByTestId('stat-open')).toHaveText('2');
  await expect(page.getByRole('heading', { name: 'Falha ao carregar dashboard' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Falha ao carregar dashboard' })).toBeVisible();
});

test('CT-08: filtra chamados por texto e status', async ({ page }) => {
  await demoLogin(page);
  await page.getByLabel('Buscar chamados').fill('intermitente');
  await expect(page.locator('.ticket-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Falha intermitente no login' })).toBeVisible();
  await page.getByLabel('Filtrar por status').selectOption('resolved');
  await expect(page.getByText('Nenhum chamado encontrado')).toBeVisible();
  await page.getByLabel('Buscar chamados').fill('');
  await expect(page.locator('.ticket-card')).toHaveCount(1);
});

test('CT-09: altera status e atualiza totais', async ({ page }) => {
  await demoLogin(page);
  await page.getByLabel('Alterar status do chamado PD-001').selectOption('resolved');
  await expect(page.getByTestId('stat-open')).toHaveText('0');
  await expect(page.getByTestId('stat-resolved')).toHaveText('2');
  await page.reload();
  await expect(page.getByLabel('Alterar status do chamado PD-001')).toHaveValue('resolved');
});

test('CT-10: trata texto de usuário como conteúdo, sem executar HTML', async ({ page }) => {
  await demoLogin(page);
  const payload = '<img src=x onerror=alert(1)> solicitação';
  await page.getByLabel('Título do chamado').fill(payload);
  await page.getByLabel('Descrição').fill('Verificação de codificação de caracteres na visualização.');
  await page.getByLabel('Prioridade').selectOption('medium');
  await page.getByRole('button', { name: 'Criar chamado' }).click();
  await expect(page.locator('.ticket-card').first().getByRole('heading')).toHaveText(payload);
  await expect(page.locator('.ticket-card img')).toHaveCount(0);
});
