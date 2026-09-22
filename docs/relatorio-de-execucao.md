# Relatório de execução — PulseDesk

Este documento separa resultados históricos de resultados da revisão de validações. As contagens se referem a testes automatizados executados no GitHub Actions, não à execução manual de todos os roteiros nem a uma certificação de ausência de defeitos.

## Revisão de validações — execução verificada em 21/09/2026

- **Evidência:** [GitHub Actions, execução 35645237260](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/runs/35645237260), referente ao commit `7b66a8a9b846d3b790c1c5f2f88b30e1ca2ee3c6` na branch `main`.
- **Ambiente da CI:** Ubuntu 24.04, Node.js 22; matriz com Chromium e Firefox via Playwright.
- **Unidade e integração:** 45 testes aprovados, 0 falhas em **cada job** da matriz. São os mesmos 45 testes repetidos em dois jobs, não 90 casos distintos.
- **E2E:** 14 cenários aprovados no Chromium e os mesmos 14 aprovados no Firefox, 0 falhas em ambos. São 14 cenários distintos, com 28 execuções distribuídas pelos dois navegadores.
- **Instalação:** `npm ci` concluiu nos dois jobs. Os logs registram avisos de depreciação de ações/Node.js 20; não foram falhas dos testes nesta execução.
- **Escopo dos cenários:** cadastro e login, chamados, filtros, mudança de status, textos HTML tratados como texto e regressões de nome, e-mail, senha e limites de chamados; consultar [plano de testes](plano-de-testes.md).

> A verificação corresponde **exatamente ao commit e à execução vinculados acima**. Se houver um commit posterior (mesmo de documentação), consulte o resultado da CI correspondente antes de afirmar que a versão mais recente passou. Os artefatos temporários do Playwright têm retenção de sete dias; o histórico e os logs da execução permanecem referenciados pelo link.

## Execução inicial — registro histórico

- [Workflow da PR #1, execução 35638859911](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/runs/35638859911), commit `3a8b17cfb0dd5dfc37daea4318b3fb333c7afa4d`.
- Naquela revisão: 27 testes unitários/de integração e 10 E2E por navegador aprovados, sem falhas relatadas. Esses números **não** descrevem a suíte ampliada.

## Limitações de validação local e execução manual

Na avaliação local da versão inicial, `npm test` registrou 27 aprovações e `node --check` não encontrou erros de sintaxe. O E2E local foi bloqueado por `ERR_BLOCKED_BY_ADMINISTRATOR`, enquanto a registry npm retornou `EAI_AGAIN`. Isso descreve aquele ambiente e momento; não deve ser confundido com a execução bem-sucedida da CI de 21/09/2026.

Os [casos manuais](casos-de-teste-manuais.md) e [roteiros de regressão manual](roteiros-regressao-validacoes.md) estão documentados, **não declarados como integralmente executados**. O defeito de aceitação de números no nome foi relatado pelo usuário e teve causa identificada por inspeção; não há outros defeitos apresentados como observados manualmente sem evidência. Veja a [auditoria de validações](auditoria-validacoes.md).

## Fora do escopo

Aplicação demonstrativa sem backend, API REST de produção, banco compartilhado ou autenticação real em servidor. Não foi realizada auditoria abrangente de segurança, acessibilidade, performance ou carga. Resultados automatizados não garantem ausência de bugs.
