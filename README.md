# PulseDesk · QA Lab

[![QA | Testes automatizados](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml/badge.svg)](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml)

**Laboratório educacional de QA com aplicação funcional, requisitos, testes manuais documentados, automação E2E e integração contínua.** Todos os dados são fictícios. Projeto desenvolvido com auxílio de IA para estudo e apresentação técnica.

## Acesse online: aplicação e automação

- **[Abrir o PulseDesk](https://edsonsilvajr08.github.io/qa-lab-portfolio/)** — navegue pelo sistema de chamados.
- **[Assistir à demonstração real da automação](https://edsonsilvajr08.github.io/qa-lab-portfolio/automacao.html)** — vídeo de um fluxo Playwright, cobertura e resultados históricos com links de comprovação.
- **[Conferir execuções no GitHub Actions](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml)** — logs, status atual e relatórios anexados por navegador.

A página de demonstração usa um vídeo WebM gerado automaticamente no GitHub Actions pelo script `scripts/record-demo.mjs` e publicado em `assets/demo/`. **O vídeo mostra uma jornada de demonstração gravada, não a execução ao vivo de toda a suíte.** As dez verificações E2E oficiais ficam em `tests/e2e/` e rodam nos navegadores Chromium e Firefox.

## Escopo

O PulseDesk permite cadastro, login, sessão por aba, criação de chamados, pesquisa, filtros, transição de status e indicadores. Inclui **27 testes unitários/de integração** e **dez cenários E2E por navegador**. O registro dos resultados realizados em 21/09/2026 está em [`docs/relatorio-de-execucao.md`](docs/relatorio-de-execucao.md); resultados após alterações devem ser conferidos na aba Actions.

## Rodar localmente

Requisitos: Node.js 20+ e npm. Não requer `.env` nem serviço externo.

```bash
npm ci
npm start
```

Acesse http://127.0.0.1:4173. O botão **Preencher** oferece a conta fictícia `demo@pulsedesk.dev` / `Demo@12345`. Não utilize senhas ou dados reais.

### Executar os testes

```bash
npm test                                 # testes unitários, persistência simulada e HTTP
npx playwright install chromium firefox   # preparar navegadores uma vez
npm run test:e2e                         # 10 casos no Chromium + 10 no Firefox
npm run test:e2e:ui                      # interface visual Playwright
npm run test:e2e:report                  # relatório HTML local
npm run check                            # unitários + E2E
```

O workflow [QA | Testes automatizados](.github/workflows/qa.yml) executa testes no push da `main`, em pull requests e manualmente. Relatórios HTML e capturas ficam como artefatos por sete dias; não afirmar aprovação sem consultar a execução correspondente.

### Regravar a demonstração

Após `npm ci` e `npx playwright install chromium`, execute `node scripts/record-demo.mjs` **com a porta 4173 livre**. O script inicia o servidor, executa e valida uma jornada de login, criação, busca e status e grava `assets/demo/automacao.webm` e `assets/demo/painel.png`. O workflow [Portfólio | Gravar demonstração](.github/workflows/demo.yml) reproduz esses passos no GitHub, disponibiliza artefatos temporários e publica o vídeo e a imagem no próprio repositório para uso no Pages; ele também pode ser iniciado manualmente na aba Actions.

## Estrutura

| Local | Responsabilidade |
|---|---|
| `index.html`, `src/app.js`, `src/styles.css` | Aplicação e jornadas do usuário |
| `automacao.html`, `src/showcase.css` | Vitrine pública de automação e evidências |
| `assets/demo/` | Vídeo real e screenshot gerados no workflow de demonstração |
| `scripts/record-demo.mjs` | Gravação e validação de jornada demonstrativa |
| `src/domain.js`, `src/storage.js` | Regras e armazenamento fictício local |
| `server.js` | Servidor HTTP para desenvolvimento e testes |
| `tests/unit/`, `tests/e2e/` | Testes unitários e automação Playwright |
| [`docs/requisitos.md`](docs/requisitos.md) | Requisitos e critérios de aceite |
| [`docs/plano-de-testes.md`](docs/plano-de-testes.md) | Estratégia e rastreabilidade CT → RF |
| [`docs/casos-de-teste-manuais.md`](docs/casos-de-teste-manuais.md) | Casos manuais documentados, ainda não executados |
| [`docs/modelo-bug-report.md`](docs/modelo-bug-report.md) | Modelo sem defeitos inventados |
| [`docs/relatorio-de-execucao.md`](docs/relatorio-de-execucao.md) | Histórico de evidências e limites |
| `.github/workflows/qa.yml`, `.github/workflows/demo.yml` | CI de regressão e gravação demonstrativa |

## Decisões e limitações

**Frontend-only por decisão de escopo:** PBKDF2/Web Crypto com sal evita persistir a senha de demonstração em texto, mas `localStorage`/`sessionStorage` são controlados pelo navegador e não equivalem a autenticação segura de produção. Não existem backend, API REST, banco remoto ou dados compartilhados entre visitantes. A sessão é limitada à aba; limpar o armazenamento reinicia o laboratório.

O CT-10 verifica que conteúdo HTML digitado em chamado é exibido como texto. Auditoria completa de acessibilidade, segurança de produção, carga e API ficam fora do escopo. Não apresentar casos manuais como executados, defeitos hipotéticos como encontrados nem atribuir experiência profissional ou autoria manual exclusiva a este projeto.

**Possíveis evoluções:** backend/API REST demonstrativos, testes de contrato, auditoria axe e melhorias de UX — apenas após implementação e verificação.

---

**Portfólio:** [Edson Silva Jr.](https://github.com/EdsonSilvaJr08). Projeto educacional desenvolvido com auxílio de IA.