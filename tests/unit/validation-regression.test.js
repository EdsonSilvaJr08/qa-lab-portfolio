import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistration, validateLogin, validateTicket, makeTicket, changeStatus, filterTickets } from '../../src/domain.js';
import { registerUser, getUsers, getTickets } from '../../src/storage.js';

const validAccount = { name: 'Edson QA', email: 'edson@example.com', password: 'Teste1234', confirmation: 'Teste1234' };
const validTicket = { title: 'Erro no formulário', description: 'O formulário não conclui o cadastro.', priority: 'high' };
class FakeStorage {
  data = new Map();
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}
globalThis.localStorage = new FakeStorage();
globalThis.sessionStorage = new FakeStorage();
beforeEach(() => { localStorage.data.clear(); sessionStorage.data.clear(); });

test('bloqueia números em qualquer posição do nome de cadastro', () => {
  for (const name of ['Edson123', '2Edson', 'Edson 2 Silva', 'Edson²', '12345']) {
    assert.match(validateRegistration({ ...validAccount, name }).name, /Números|nome/);
  }
});

test('bloqueia caracteres estranhos, HTML, emoji e pontuação repetida no nome', () => {
  for (const name of ['Ana_ QA', '<img src=x>', 'Edson 😎', 'Ana--Maria', "O''Connor", ' Ana!']) {
    assert.ok(validateRegistration({ ...validAccount, name }).name, name);
  }
});

test('aceita nomes com acentos, hífens e apóstrofos sem restringir nomes internacionais', () => {
  for (const name of ['João da Silva', 'Ana-Maria', "D'Ávila", 'O’Connor', '李 小龍', 'Érica']) {
    assert.deepEqual(validateRegistration({ ...validAccount, name }), {}, name);
  }
});

test('normaliza espaços internos apenas ao persistir, sem aceitar nome só com espaços', () => {
  assert.ok(validateRegistration({ ...validAccount, name: '        ' }).name);
  assert.deepEqual(validateRegistration({ ...validAccount, name: '  Ana   Maria  ' }), {});
});

test('valida limites do nome incluindo 2 e 60 caracteres', () => {
  assert.deepEqual(validateRegistration({ ...validAccount, name: 'Li' }), {});
  assert.deepEqual(validateRegistration({ ...validAccount, name: 'A'.repeat(60) }), {});
  assert.ok(validateRegistration({ ...validAccount, name: 'A'.repeat(61) }).name);
});

test('bloqueia formatos de e-mail que regex permissiva aceitava', () => {
  for (const email of ['ana..silva@example.com', '.ana@example.com', 'ana.@example.com', 'ana@-example.com', 'ana@example-.com', 'ana@example..com', 'ana@ex_ample.com', 'ana@example.c', 'ana@@example.com', 'ana@example.com outra']) {
    assert.ok(validateRegistration({ ...validAccount, email }).email, email);
    assert.ok(validateLogin({ email, password: 'Senha1234' }).email, email);
  }
});

test('aceita e-mail com subdomínio, alias e capitalização após normalização', () => {
  assert.deepEqual(validateRegistration({ ...validAccount, email: '  EDSON+QA@SUB.EXAMPLE.COM  ' }), {});
});

test('limita tamanho do e-mail e das partes do domínio', () => {
  assert.ok(validateRegistration({ ...validAccount, email: `${'a'.repeat(65)}@example.com` }).email);
  assert.ok(validateRegistration({ ...validAccount, email: `a@${'x'.repeat(64)}.com` }).email);
});

test('senha aceita acentos, números e limites declarados', () => {
  for (const password of ['Árvore123', `A1${'x'.repeat(126)}`]) {
    assert.deepEqual(validateRegistration({ ...validAccount, password, confirmation: password }), {});
  }
});

test('senha rejeita acima de 128 e sem letras ou números', () => {
  for (const password of [`A1${'x'.repeat(127)}`, '1234567890', 'abcdEFGH']) {
    assert.ok(validateRegistration({ ...validAccount, password, confirmation: password }).password);
  }
});

test('chamado valida limites inferior e superior, inclusive espaços', () => {
  assert.deepEqual(validateTicket({ title: 'A'.repeat(5), description: 'B'.repeat(10), priority: 'low' }), {});
  assert.deepEqual(validateTicket({ title: 'A'.repeat(80), description: 'B'.repeat(500), priority: 'medium' }), {});
  for (const data of [
    { ...validTicket, title: ' '.repeat(20) },
    { ...validTicket, title: 'A'.repeat(81) },
    { ...validTicket, description: ' '.repeat(20) },
    { ...validTicket, description: 'B'.repeat(501) },
    { ...validTicket, priority: '' }
  ]) assert.ok(Object.keys(validateTicket(data)).length > 0);
});

test('filtragem combina busca e status, ignora caixa e não confunde códigos', () => {
  const tickets = [
    makeTicket(validTicket, 'PD-001'),
    changeStatus(makeTicket({ ...validTicket, title: 'Erro na Busca' }, 'PD-002'), 'resolved')
  ];
  assert.deepEqual(filterTickets(tickets, { query: 'BUSCA', status: 'open' }), []);
  assert.equal(filterTickets(tickets, { query: 'busca', status: 'resolved' })[0].id, 'PD-002');
});

test('rejeita nome com números ao chamar armazenamento sem passar pelo formulário', async () => {
  await assert.rejects(registerUser({ name: 'Ana123', email: 'ana@example.com', password: 'Segredo123' }), /inválidos/);
  assert.equal(getUsers().length, 0);
});

test('rejeita e-mail malformado e senha fraca diretamente na camada de persistência', async () => {
  await assert.rejects(registerUser({ name: 'Ana Teste', email: 'ana..qa@example.com', password: 'Segredo123' }), /inválidos/);
  await assert.rejects(registerUser({ name: 'Ana Teste', email: 'ana@example.com', password: 'somenteletras' }), /inválidos/);
  assert.equal(getUsers().length, 0);
});

test('normaliza espaços internos de nome sem afetar letras acentuadas', async () => {
  await registerUser({ name: '  João   da   Silva  ', email: 'joao@example.com', password: 'Segredo123' });
  assert.equal(getUsers()[0].name, 'João da Silva');
});

test('impede duplicidade em registros simultâneos do mesmo e-mail', async () => {
  const attempts = await Promise.allSettled([
    registerUser({ name: 'Ana Teste', email: 'ana@example.com', password: 'Segredo123' }),
    registerUser({ name: 'Bia Teste', email: 'ANA@EXAMPLE.COM', password: 'Segredo123' })
  ]);
  assert.equal(attempts.filter(item => item.status === 'fulfilled').length, 1);
  assert.equal(attempts.filter(item => item.status === 'rejected').length, 1);
  assert.equal(getUsers().length, 1);
});

test('ignora registros corrompidos ou com prioridade injetada no armazenamento', async () => {
  const user = await registerUser({ name: 'Ana Teste', email: 'ana@example.com', password: 'Segredo123' });
  const good = { id: 'PD-001', title: 'Erro normal', description: 'Descrição válida do defeito.', priority: 'medium', status: 'open', createdAt: '2026-09-21T12:00:00.000Z' };
  localStorage.setItem(`pulsedesk:v1:tickets:${user.id}`, JSON.stringify([good, { ...good, id: 'PD-002', priority: 'high" onmouseover="alert(1)' }, null, { ...good, id: 'PD-003', createdAt: 'invalida' }]));
  assert.deepEqual(getTickets(user.id), [good]);
});

test('ignora registro de usuário incompleto em armazenamento corrompido', () => {
  localStorage.setItem('pulsedesk:v1:users', JSON.stringify([null, { id: 'x' }]));
  assert.deepEqual(getUsers(), []);
});
