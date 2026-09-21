# PulseDesk · QA Lab

[![QA | Testes automatizados](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml/badge.svg)](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml)

**Projeto educacional de QA: aplicação funcional, requisitos rastreáveis, testes unitários, automação E2E e CI.** Os dados e cenários são fictícios; não representam cliente real nem autenticação de produção.

## O projeto

PulseDesk é um gerenciador demonstrativo de chamados. O laboratório cobre cadastro, login, sessão por aba, criação de tickets, filtros, transição de status e indicadores. Foi construído para demonstrar estratégia de teste, não apenas scripts. Inclui 27 testes com `node:test`, dez cenários E2E descritos em Playwright, matriz de rastreabilidade e pipeline Chromium/Firefox. **Verifique os resultados reais de execução em Actions; testes escritos não são necessariamente aprovados.**

## Rodar localmente

Requisitos: Node.js 20+ e npm. Não exige `.env` nem serviço externo.

```bash
npm ci
npm start
```

Abra http://127.0.0.1:4173. Clique em **Preencher** para usar a conta fictícia `demo@pulsedesk.dev` / `Demo@12345` ou crie uma conta de teste.

### Executar testes

```bash
npm test                             # regras de negócio, persistência simulada e HTTP
npx playwright install chromium firefox # instalar os navegadores uma vez
npm run test:e2e                     # dez cenários em dois navegadores
npm run check                        # unitários + E2E
npm run test:e2e:report              # relatório HTML local
```

O GitHub Actions roda no push à main, em pull requests e por execução manual. Resultados e evidências de falha ficam em **Actions**; screenshots, traces e relatório HTML são preservados por sete dias nas execuções que falharem.

## Navegar pela estrutura

| Local | Responsabilidade |
|---|---|
| `index.html`, `src/app.js`, `src/styles.css` | Interface responsiva e jornadas do usuário |
| `src/domain.js` | Regras de validação, tickets, busca e indicadores |
| `src/storage.js` | Contas e chamados fictícios armazenados no navegador |
| `server.js` | Servidor HTTP de arquivos estáticos |
| `tests/unit/` | Validações, persistência simulada e servidor |
| `tests/e2e/` | Jornadas funcionais automatizadas com Playwright |
| [`docs/requisitos.md`](docs/requisitos.md) | Requisitos e critérios de aceite |
| [`docs/plano-de-testes.md`](docs/plano-de-testes.md) | Estratégia, dados e matriz CT → RF |
| [`docs/modelo-bug-report.md`](docs/modelo-bug-report.md) | Modelo de registro de defeito, sem bugs inventados |
| [`docs/relatorio-de-execucao.md`](docs/relatorio-de-execucao.md) | Resultados observados e bloqueios explícitos |
| `.github/workflows/qa.yml` | CI unitária e navegador em matriz |

## Limitações e decisões

**Frontend-only deliberado:** PBKDF2/Web Crypto com sal impede gravar a senha de exemplo em texto puro, mas não fornece autenticação segura: `localStorage` e `sessionStorage` estão sob controle do usuário. Não há backend, permissões de servidor, banco remoto nem API REST. Não utilize senhas ou informações reais. Contas vivem no navegador; a sessão é limitada à aba; limpar armazenamento reinicia o laboratório.

Entradas de chamados são escapadas antes da renderização; CT-10 verifica que HTML digitado é exibido como texto. Acessibilidade abrangente, segurança de produção, testes de carga, deploy público e API ficam fora do escopo. **Não atribuir experiência profissional ou autoria manual exclusiva ao laboratório.**

## Próximas melhorias

Backend/API REST demonstrativos, testes de contrato, auditoria de acessibilidade com axe, melhorias de UX e deploy público. Essas evoluções só serão descritas como concluídas depois de implementadas e testadas.

---

**Portfólio:** [Edson Silva Jr.](https://github.com/EdsonSilvaJr08). Projeto educacional desenvolvido com auxílio de IA para estudo, revisão e apresentação técnica.