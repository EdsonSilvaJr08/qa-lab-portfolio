# Plano de testes e rastreabilidade — PulseDesk

**Objetivo:** demonstrar requisito → cenário → execução → evidência; trata-se de laboratório fictício. **Ambiente:** Node.js 20+, Chromium/Firefox, servidor local `http://127.0.0.1:4173`. Cada teste E2E utiliza contexto novo de navegador. Não inserir dados pessoais. **Critério de saída:** executar e analisar resultados, registrar falhas e guardar links da CI sem apresentar testes escritos como aprovados.

| Caso | Requisito | Tipo | Resultado esperado | Arquivo |
|---|---|---|---|---|
| CT-01 | RF-01, RF-03, RF-04 | E2E | Cadastro, login, atualização da aba e logout | `tests/e2e/auth.spec.js` |
| CT-02 | RF-01 | E2E negativo | Campos obrigatórios e senha divergente bloqueados | `tests/e2e/auth.spec.js` |
| CT-03 | RF-02 | E2E negativo | E-mail duplicado bloqueado independentemente da caixa | `tests/e2e/auth.spec.js` |
| CT-04 | RF-03 | E2E negativo | Erro em credenciais incorretas | `tests/e2e/auth.spec.js` |
| CT-05 | RF-03 | E2E positivo | Conta demo e três chamados iniciais | `tests/e2e/auth.spec.js` |
| CT-06 | RF-05 | E2E negativo | Chamado inválido não persistido | `tests/e2e/tickets.spec.js` |
| CT-07 | RF-05, RF-08 | E2E positivo | Criação, persistência e indicadores | `tests/e2e/tickets.spec.js` |
| CT-08 | RF-06 | E2E | Busca e filtro combinados | `tests/e2e/tickets.spec.js` |
| CT-09 | RF-07, RF-08 | E2E | Alterar status e persistir totais | `tests/e2e/tickets.spec.js` |
| CT-10 | RNF-01 | E2E negativo | HTML no título não é interpretado | `tests/e2e/tickets.spec.js` |
| CT-11 | RF-01 | E2E regressão | Números rejeitados no nome; acentos, hífen e apóstrofo aceitos | `tests/e2e/validation.spec.js` |
| CT-12 | RF-01 | E2E regressão | E-mails malformados rejeitados e alias válido aceito | `tests/e2e/validation.spec.js` |
| CT-13 | RF-01 | E2E regressão | Senha acima do limite rejeitada | `tests/e2e/validation.spec.js` |
| CT-14 | RF-05, RF-08 | E2E regressão | Limites 80/500, contador permanece após falha | `tests/e2e/validation.spec.js` |
| UT-01–16 | RF-01, RF-03, RF-05–RF-08 | Unidade | Validações, status, filtros e estatísticas | `tests/unit/domain.test.js` |
| UT-17–22 | RF-01–RF-05 | Unidade | Persistência, hash, sessão e isolamento | `tests/unit/storage.test.js` |
| UT-23–27 | RNF-03 | Integração HTTP | Roteamento, bloqueio de caminhos e métodos | `tests/unit/server.test.js` |
| UT-28–45 | RF-01, RF-02, RF-05, RF-06, RNF-01 | Unidade/regressão | Limites, Unicode, duplicidade, dados corrompidos e prioridade injetada | `tests/unit/validation-regression.test.js` |

## Comandos

```bash
npm ci
npm test
npx playwright install chromium firefox
npm run test:e2e
npm run test:e2e:report
```

**Riscos remanescentes:** autenticação é demonstrativa, armazenamento controlado pelo navegador, e-mail aceita subconjunto comum ASCII (não todo RFC), não há auditoria completa de segurança, carga e acessibilidade, nem validação em backend. Ao divulgar números de aprovação, informar data, commit, SO, navegador e link da execução. Consulte [auditoria](auditoria-validacoes.md), [casos manuais](casos-de-teste-manuais.md) e [relatório de execução](relatorio-de-execucao.md).
