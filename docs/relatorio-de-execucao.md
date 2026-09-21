# Relatório de execução — 21/09/2026

## Evidência remota: GitHub Actions

- **Execução inicial verificada:** [workflow da PR #1 — run 35638859911](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/runs/35638859911), commit `3a8b17cfb0dd5dfc37daea4318b3fb333c7afa4d`.
- **Unitários/integração:** 27 aprovados, 0 falhas, executados em cada um dos dois jobs da matriz.
- **E2E Playwright:** dez casos aprovados no Chromium **e** dez no Firefox; nenhuma falha observada nessa execução inicial.
- **Instalação:** `npm ci` concluiu em ambos os jobs da CI.

## Validação no ambiente local

- `npm test`: 27 aprovados, zero falhas.
- Verificação de sintaxe dos módulos com `node --check`: sem erros.
- A execução E2E local ficou bloqueada: navegador retorna `ERR_BLOCKED_BY_ADMINISTRATOR` até em páginas de teste e a registry npm não responde (`EAI_AGAIN`). Esse bloqueio é **do ambiente local**, não invalida os resultados efetivos da CI acima.

## Evidências de screenshots e última execução

O workflow anexa screenshots de fluxos fictícios ao relatório HTML e publica um artefato `playwright-<navegador>` por job, inclusive em sucesso, retido por sete dias. Para comunicar resultados após alterações, **verificar a execução mais recente da branch `main` na aba [Actions](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions)**. Uma execução aprovada em commit anterior não garante que alterações posteriores estejam aprovadas.

## Fora do escopo

Não há auditoria completa de acessibilidade, segurança de produção, carga ou API REST. Casos manuais estão documentados, mas não há execução manual declarada; consulte [casos manuais](casos-de-teste-manuais.md). Defeitos não são simulados como se fossem encontrados.
