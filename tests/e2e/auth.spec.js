import { test, expect } from '@playwright/test';

const account = { name: 'Edson de Teste', email: 'edson.qa@example.com', password: 'Senha12345' };
async function register(page) {
  await page.getByRole('button', { name: 'Criar conta' }).first().click();
  await page.getByLabel('Nome completo').fill(account.name);
  await page.getByLabel('E-mail').fill(account.email);
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByLabel('Confirmar senha').fill(account.password);
  await page.getByRole('button', { name: 'Criar conta', exact: true }).last().click();
  await expect(page.getByRole('status')).toContainText('Conta criada!');
}

test('CT-01: usuário pode criar conta, entrar, persistir sessão e sair', async ({ page }) => {
  await page.goto('/');
  await register(page);
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(page.getByRole('heading', { name: /Olá, Edson/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: /Olá, Edson/ })).toBeVisible();
  await page.getByRole('button', { name: 'Sair da conta' }).click();
  await expect(page.getByRole('heading', { name: 'Entre no seu espaço.' })).toBeVisible();
});

test('CT-02: valida campos obrigatórios e confirmação de senha', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Criar conta' }).first().click();
  await page.locator('#auth-form [type="submit"]').click();
  await expect(page.locator('#name-error')).toContainText('nome');
  await expect(page.locator('#email-error')).toContainText('e-mail');
  await expect(page.locator('#password-error')).toContainText('8 caracteres');
  await page.getByLabel('Nome completo').fill('Ana Teste');
  await page.getByLabel('E-mail').fill('ana@example.com');
  await page.getByLabel('Senha', { exact: true }).fill('Senha12345');
  await page.getByLabel('Confirmar senha').fill('NaoCombina9');
  await page.locator('#auth-form [type="submit"]').click();
  await expect(page.locator('#confirmation-error')).toContainText('não coincidem');
});

test('CT-03: cadastro duplicado é bloqueado independentemente da capitalização do e-mail', async ({ page }) => {
  await page.goto('/');
  await register(page);
  await page.getByRole('button', { name: 'Criar conta' }).first().click();
  await page.getByLabel('Nome completo').fill('Duplicado');
  await page.getByLabel('E-mail').fill('EDSON.QA@example.com');
  await page.getByLabel('Senha', { exact: true }).fill(account.password);
  await page.getByLabel('Confirmar senha').fill(account.password);
  await page.locator('#auth-form [type="submit"]').click();
  await expect(page.getByRole('alert')).toContainText('já está cadastrado');
});

test('CT-04: credenciais inválidas não permitem login', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('E-mail').fill('naoexiste@example.com');
  await page.getByLabel('Senha').fill('Qualquer123');
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(page.getByRole('alert')).toContainText('incorretos');
  await expect(page.getByRole('heading', { name: 'Entre no seu espaço.' })).toBeVisible();
});

test('CT-05: demonstração possui dados fictícios e permite acesso', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Preencher' }).click();
  await expect(page.getByLabel('E-mail')).toHaveValue('demo@pulsedesk.dev');
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(page.getByTestId('stat-total')).toHaveText('3');
});
