import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { seedDemo, registerUser, authenticate, getUsers, getSession, setSession, clearSession, getTickets, saveTickets } from '../../src/storage.js';

class FakeStorage {
  data = new Map();
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}
globalThis.localStorage = new FakeStorage();
globalThis.sessionStorage = new FakeStorage();
beforeEach(() => { localStorage.data.clear(); sessionStorage.data.clear(); });

test('cria usuário com hash e sal, nunca persiste senha em texto', async () => {
  await registerUser({ name: '  Ana Teste  ', email: ' ANA@EXAMPLE.COM ', password: 'Segredo123' });
  assert.equal(getUsers()[0].email, 'ana@example.com');
  assert.equal(getUsers()[0].name, 'Ana Teste');
  assert.equal(getUsers()[0].hash.length, 64);
  assert.equal(localStorage.getItem('pulsedesk:v1:users').includes('Segredo123'), false);
});
test('impede cadastro duplicado ignorando caixa', async () => {
  await registerUser({ name: 'Ana', email: 'ana@example.com', password: 'Segredo123' });
  await assert.rejects(registerUser({ name: 'Bia', email: 'ANA@example.com', password: 'Outra1234' }), /já está cadastrado/);
});
test('autentica usuário válido e recusa senha incorreta', async () => {
  await registerUser({ name: 'Ana', email: 'ana@example.com', password: 'Segredo123' });
  assert.equal((await authenticate(' ANA@EXAMPLE.COM ', 'Segredo123')).email, 'ana@example.com');
  assert.equal(await authenticate('ana@example.com', 'errada'), null);
  assert.equal(await authenticate('inexistente@example.com', 'Segredo123'), null);
});
test('sessão depende de ID existente e logout limpa sessão', async () => {
  const user = await registerUser({ name: 'Ana', email: 'ana@example.com', password: 'Segredo123' });
  setSession(user);
  assert.equal(getSession().name, 'Ana');
  clearSession();
  assert.equal(getSession(), null);
  sessionStorage.setItem('pulsedesk:v1:session', 'inexistente');
  assert.equal(getSession(), null);
});
test('conta demo inicializa com três registros apenas uma vez', async () => {
  await seedDemo();
  await seedDemo();
  assert.equal(getUsers().length, 1);
  assert.equal(getTickets(getUsers()[0].id).length, 3);
});
test('chamados são isolados por usuário', async () => {
  const a = await registerUser({ name: 'Ana', email: 'ana@example.com', password: 'Segredo123' });
  const b = await registerUser({ name: 'Bia', email: 'bia@example.com', password: 'Segredo123' });
  saveTickets(a.id, [{ id: 'PD-001' }]);
  assert.deepEqual(getTickets(b.id), []);
});
