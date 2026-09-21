import { test, expect } from '@playwright/test';

const password = 'Senha12345';

async function openRegistration(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Criar conta' }).first().click();
  await page.getByLabel('E-mail').fill('teste@example.com');
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByLabel('Confirmar senha').fill(password);
}

test('CT-11: nome com números é rejeitado, nome acentuado e composto é aceito', async ({ page }) => {
  await openRegistration(page);
  for (const name of ['Edson123', '123 Edson', 'Edson 2 Silva']) {
    await page.getByLabel('Nome completo').fill(name);
    await page.locator('#auth-form [type="submit"]').click();
    await expect(page.locator('#name-error')).toContainText('Números não são permitidos');
    await expect(page.getByRole('heading', { name: 'Crie sua conta.' })).toBeVisible();
  }
  await page.getByLabel('Nome completo').fill('Ana-Maria D’Ávila');
  await page.locator('#auth-form [type="submit"]').click();
  await expect(page.getByRole('status')).toContainText('Conta criada!');
});

test('CT-12: e-mails com pontos repetidos, domínio inválido e formato normal são tratados', async ({ page }) => {
  await openRegistration(page);
  await page.getByLabel('Nome completo').fill('Ana Teste');
  for (const email of ['ana..silva@example.com', 'ana@-example.com', 'ana@example..com']) {
    await page.getByLabel('E-mail').fill(email);
    await page.locator('#auth-form [type="submit"]').click();
    await expect(page.locator('#email-error')).toContainText('e-mail válido');
  }
  await page.getByLabel('E-mail').fill('ANA+QA@EXAMPLE.COM');
  await page.locator('#auth-form [type="submit"]').click();
  await expect(page.getByRole('status')).toContainText('Conta criada!');
});

test('CT-13: senha acima do limite é bloqueada sem cadastrar usuário', async ({ page }) => {
  await openRegistration(page);
  await page.getByLabel('Nome completo').fill('Ana Teste');
  const longPassword = `A1${'x'.repeat(127)}`;
  await page.getByLabel('Senha', { exact: true }).fill(longPassword);
  await page.getByLabel('Confirmar senha').fill(longPassword);
  await page.locator('#auth-form [type="submit"]').click();
  await expect(page.locator('#password-error')).toContainText('128 caracteres');
  await expect(page.getByRole('heading', { name: 'Crie sua conta.' })).toBeVisible();
});

test('CT-14: chamado longo ou vazio não altera indicadores; limites válidos permitem criação', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Preencher' }).click();
  await page.getByRole('button', { name: 'Entrar no painel' }).click();
  await expect(page.getByTestId('stat-total')).toHaveText('3');
  await page.getByLabel('Título do chamado').fill('A'.repeat(81));
  await page.getByLabel('Descrição').fill('B'.repeat(501));
  await page.getByLabel('Prioridade').selectOption('high');
  await page.getByRole('button', { name: 'Criar chamado' }).click();
  await expect(page.locator('#title-error')).toContainText('80');
  await expect(page.locator('#description-error')).toContainText('500');
  await expect(page.getByTestId('stat-total')).toHaveText('3');
  await page.getByLabel('Título do chamado').fill('A'.repeat(80));
  await page.getByLabel('Descrição').fill('B'.repeat(500));
  await page.getByRole('button', { name: 'Criar chamado' }).click();
  await expect(page.getByTestId('stat-total')).toHaveText('4');
});
