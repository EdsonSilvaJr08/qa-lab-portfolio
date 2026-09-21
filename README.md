# PulseDesk · QA Lab

[![QA | Testes automatizados](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml/badge.svg)](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml)

Aplicação fictícia de gerenciamento de chamados para estudo de QA manual, automação E2E, testes unitários e CI. Desenvolvido com auxílio de IA, com dados exclusivamente fictícios; não representa produto de produção ou cliente real.

## Acessar e verificar

- [Aplicação PulseDesk online](https://edsonsilvajr08.github.io/qa-lab-portfolio/): cadastro, login, chamados, filtros e indicadores.
- [Vídeo e estudo técnico da automação](https://edsonsilvajr08.github.io/qa-lab-portfolio/automacao.html): gravação real de uma jornada demonstrativa, diferente da suíte E2E completa.
- [GitHub Actions](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml): histórico de execuções, logs e relatórios. **Conferir o commit e resultado mais recente; um badge verde anterior não garante uma versão nova.**

## Como executar

Node.js 20+ e npm; sem `.env` ou serviços externos.

```bash
npm ci
npm start
# abrir http://127.0.0.1:4173
```

Clique em **Preencher** para usar a conta fictícia de demonstração. Não use credenciais ou dados reais. Contas e tickets ficam no `localStorage` do seu próprio navegador; a sessão usa `sessionStorage`.

```bash
npm test                                # 45 casos de unidade/integração
npx playwright install chromium firefox # instalação dos navegadores uma vez
npm run test:e2e                        # 14 cenários em Chromium e Firefox
npm run test:e2e:ui                     # interface visual do Playwright
npm run test:e2e:report                 # abrir relatório HTML local
npm run check                           # unidade/integração e E2E
```

Os números acima representam o conjunto **definido**, não um atestado permanente de aprovação. O pipeline executa a matriz nos dois navegadores a cada PR e push na `main`; consulte as execuções específicas e os artefatos temporários.

## Estratégia e artefatos

| Recurso | Local |
|---|---|
| Interface e regras | `index.html`, `src/app.js`, `src/styles.css`, `src/domain.js` |
| Persistência demonstrativa | `src/storage.js` |
| Servidor estático | `server.js` |
| Suíte unitária/de integração | `tests/unit/` |
| Suíte E2E | `tests/e2e/` |
| [Requisitos e critérios de aceite](docs/requisitos.md) | `docs/requisitos.md` |
| [Plano de testes e rastreabilidade](docs/plano-de-testes.md) | `docs/plano-de-testes.md` |
| [Casos manuais — ainda não executados](docs/casos-de-teste-manuais.md) | `docs/casos-de-teste-manuais.md` |
| [Regressão manual — ainda não executada](docs/roteiros-regressao-validacoes.md) | `docs/roteiros-regressao-validacoes.md` |
| [Auditoria de validações e regressão](docs/auditoria-validacoes.md) | `docs/auditoria-validacoes.md` |
| [Relatório de execução](docs/relatorio-de-execucao.md) | `docs/relatorio-de-execucao.md` |
| [Modelo de bug report](docs/modelo-bug-report.md) | `docs/modelo-bug-report.md` |
| Workflows | `.github/workflows/qa.yml` e `.github/workflows/demo.yml` |

### Revisão de validações de 21/09/2026

Após relato de aceitação de números no campo Nome, foram definidas e implementadas regras de caracteres do nome (Unicode, acentos, espaços, hífen e apóstrofo; sem dígitos), formato comum de e-mail, limite superior de senha, validação na persistência, proteção ao ler armazenamento inválido e regressões dos limites de tickets. Veja a [auditoria com causa e limites](docs/auditoria-validacoes.md). O formulário permite digitar e colar qualquer texto, mas **rejeita entradas inválidas ao enviar, com explicação no campo**.

## Limitações técnicas

Frontend-only: não possui backend, API, banco compartilhado, controle de acesso real ou autenticação de produção. PBKDF2 local não fornece segurança de servidor. Teste de exibição de HTML não substitui pentest; não há auditoria abrangente de acessibilidade, segurança ou performance. Usuários cadastrados anteriormente não são migrados automaticamente. Os roteiros manuais não são tratados como executados sem evidências. Alterações futuras exigem nova verificação.

**Portfólio:** [Edson Silva Jr.](https://github.com/EdsonSilvaJr08). Projeto educacional construído com auxílio de IA para estudo e explicação técnica; não atribuir autoria manual exclusiva ou experiência profissional originada deste laboratório.
