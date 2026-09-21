import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../../server.js';
let url;
before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  url = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });

test('serve HTML principal com MIME correto', async () => {
  const response = await fetch(url);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /PulseDesk/);
});
test('serve módulos da aplicação', async () => {
  const response = await fetch(`${url}/src/domain.js`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /validateRegistration/);
});
test('retorna 404 para arquivo inexistente', async () => {
  assert.equal((await fetch(`${url}/arquivo-inexistente`)).status, 404);
});
test('nega acesso a arquivos de configuração e dependências', async () => {
  assert.equal((await fetch(`${url}/.gitignore`)).status, 400);
  assert.equal((await fetch(`${url}/node_modules/segredo`)).status, 400);
});
test('nega métodos de escrita', async () => {
  const response = await fetch(url, { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});
