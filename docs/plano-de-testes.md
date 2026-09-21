# Plano de testes e rastreabilidade — PulseDesk

**Objetivo:** demonstrar o caminho requisito → caso de teste → automação → evidência. Não se trata de testes em um produto de cliente real.

**Escopo:** cadastro, login e sessão, chamados, busca/filtro, status, indicadores e renderização de conteúdo. **Ambiente:** Node.js 20+, navegador Chromium/Firefox, servidor local `http://127.0.0.1:4173`.

**Pré-condições:** dependências instaladas (`npm ci`); ambiente acessível; perfil do navegador limpo para cada teste. **Dados:** apenas e-mails `@example.com` e conta fictícia de demonstração `demo@pulsedesk.dev`. **Critério de saída:** unitários e E2E executados, resultados analisados e reportados sem esconder falhas.

## Matriz de rastreabilidade

| Caso | Requisito | Tipo | Resultado esperado | Arquivo |
|---|---|---|---|---|
| CT-01 | RF-01, RF-03, RF-04 | E2E | Cadastro, login, refresh e logout | `tests/e2e/auth.spec.js` |
| CT-02 | RF-01 | E2E negativo | Campos inválidos e confirmação divergente bloqueados | `tests/e2e/auth.spec.js` |
| CT-03 | RF-02 | E2E negativo | Conta duplicada bloqueada sem diferenciar caixa | `tests/e2e/auth.spec.js` |
| CT-04 | RF-03 | E2E negativo | Erro em credencial incorreta | `tests/e2e/auth.spec.js` |
| CT-05 | RF-03 | E2E positivo | Conta demo e três tickets iniciais | `tests/e2e/auth.spec.js` |
| CT-06 | RF-05 | E2E negativo | Chamado inválido não persistido | `tests/e2e/tickets.spec.js` |
| CT-07 | RF-05, RF-08 | E2E positivo | Criar e persistir chamado e atualizar indicadores | `tests/e2e/tickets.spec.js` |
| CT-08 | RF-06 | E2E | Busca e filtro combinados | `tests/e2e/tickets.spec.js` |
| CT-09 | RF-07, RF-08 | E2E | Status persistido e indicadores atualizados | `tests/e2e/tickets.spec.js` |
| CT-10 | RNF-01 | E2E negativo | Entrada HTML exibida como texto, não executada | `tests/e2e/tickets.spec.js` |
| UT-01–16 | RF-01, RF-03, RF-05–RF-08 | Unidade | Validações, transição, filtragem e totais | `tests/unit/domain.test.js` |
| UT-17–22 | RF-01–RF-05 | Unidade | Armazenamento, hash local, sessão e isolamento | `tests/unit/storage.test.js` |
| UT-23–27 | RNF-03 | Integração HTTP | Roteamento estático, bloqueio de caminhos e métodos | `tests/unit/server.test.js` |

## Execução

```bash
npm ci
npm test
npx playwright install chromium firefox
npm run test:e2e
npm run test:e2e:report
```

**Riscos:** laboratório local não valida segurança, carga, disponibilidade de produção, API ou acessibilidade completa. Documentar data, commit, SO, navegador, aprovado/falhou/bloqueado e evidência. Não confundir cenários escritos com cenários aprovados.