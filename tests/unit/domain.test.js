import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEmail, validateRegistration, validateLogin, validateTicket, makeTicket, changeStatus, filterTickets, ticketStats } from '../../src/domain.js';

const validAccount = { name: 'Edson QA', email: 'edson@example.com', password: 'Teste1234', confirmation: 'Teste1234' };
const validTicket = { title: 'Erro no formulário', description: 'O formulário não conclui o cadastro.', priority: 'high' };

test('normaliza e-mail removendo espaços e maiúsculas', () => assert.equal(normalizeEmail('  QA@EXAMPLE.COM '), 'qa@example.com'));
test('aceita cadastro válido', () => assert.deepEqual(validateRegistration(validAccount), {}));
test('rejeita nome com menos de 2 caracteres', () => assert.ok(validateRegistration({ ...validAccount, name: 'A' }).name));
test('rejeita nome com mais de 60 caracteres', () => assert.ok(validateRegistration({ ...validAccount, name: 'a'.repeat(61) }).name));
test('rejeita e-mail inválido', () => assert.ok(validateRegistration({ ...validAccount, email: 'invalido@' }).email));
test('rejeita senha curta ou sem número', () => {
  assert.ok(validateRegistration({ ...validAccount, password: 'abc', confirmation: 'abc' }).password);
  assert.ok(validateRegistration({ ...validAccount, password: 'abcdefgh', confirmation: 'abcdefgh' }).password);
});
test('rejeita confirmação de senha diferente', () => assert.ok(validateRegistration({ ...validAccount, confirmation: 'Outro1234' }).confirmation));
test('login exige e-mail e senha', () => assert.deepEqual(Object.keys(validateLogin({ email: 'ruim', password: '' })).sort(), ['email', 'password']));
test('aceita chamado válido', () => assert.deepEqual(validateTicket(validTicket), {}));
test('rejeita título curto, descrição curta e prioridade desconhecida', () => assert.equal(Object.keys(validateTicket({ title: 'abc', description: 'curta', priority: 'urgent' })).length, 3));
test('cria chamado com estado aberto e data conhecida', () => {
  const ticket = makeTicket(validTicket, 'PD-001', new Date('2026-09-21T12:00:00.000Z'));
  assert.equal(ticket.status, 'open');
  assert.equal(ticket.id, 'PD-001');
  assert.equal(ticket.createdAt, '2026-09-21T12:00:00.000Z');
});
test('recusa criação com chamado inválido', () => assert.throws(() => makeTicket({}, 'PD-002'), /inválido/));
test('aceita alteração de status sem mutar registro original', () => {
  const ticket = makeTicket(validTicket, 'PD-001');
  const updated = changeStatus(ticket, 'resolved');
  assert.equal(updated.status, 'resolved');
  assert.equal(ticket.status, 'open');
});
test('rejeita status desconhecido', () => assert.throws(() => changeStatus({}, 'deleted'), /Status inválido/));
test('filtra por texto, código e status sem alterar lista original', () => {
  const a = makeTicket(validTicket, 'PD-001');
  const b = changeStatus(makeTicket({ ...validTicket, title: 'Problema na busca' }, 'PD-002'), 'resolved');
  assert.deepEqual(filterTickets([a, b], { query: 'BUSCA', status: 'resolved' }).map(t => t.id), ['PD-002']);
  assert.deepEqual(filterTickets([a, b], { query: 'PD-001' }).map(t => t.id), ['PD-001']);
  assert.equal(filterTickets([a, b], { status: 'open' }).length, 1);
});
test('calcula contagem corretamente inclusive em lista vazia', () => {
  assert.deepEqual(ticketStats([]), { total: 0, open: 0, in_progress: 0, resolved: 0 });
  assert.deepEqual(ticketStats([makeTicket(validTicket, 'A'), changeStatus(makeTicket(validTicket, 'B'), 'in_progress'), changeStatus(makeTicket(validTicket, 'C'), 'resolved')]), { total: 3, open: 1, in_progress: 1, resolved: 1 });
});
