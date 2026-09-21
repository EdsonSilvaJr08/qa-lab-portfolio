# Casos de teste manuais — PulseDesk v1.0

**Status:** roteiros preparados, não executados manualmente. As evidências e aprovações automatizadas pertencem exclusivamente ao Playwright e ao pipeline vinculado no [relatório](relatorio-de-execucao.md). Para execução manual, preencher executor, data, navegador, resultado e evidência real.

**Ambiente:** `npm start`, http://127.0.0.1:4173; janela anônima/perfil limpo quando indicado. **Dados:** somente fictícios; usar `@example.com` para cadastros. Cada caso deve partir do estado indicado para evitar contaminação de dados.

| Caso / RF | Pré-condição | Ações manuais | Resultado esperado |
|---|---|---|---|
| CT-01 / RF-01, 03, 04 | Perfil limpo | Criar conta com nome `Edson Teste`, `edson@example.com`, senha `Teste12345` e confirmação; fazer login, recarregar e sair. | Cadastro confirmado; painel abre, recarregar preserva sessão na aba e logout volta ao login. |
| CT-02 / RF-01 | Perfil limpo | Abrir Criar conta; enviar formulário vazio; em seguida preencher dados válidos exceto confirmação diferente e reenviar. | Erros ao lado dos campos obrigatórios; divergência de senhas bloqueia criação. |
| CT-03 / RF-02 | Conta `edson@example.com` já criada | Reabrir cadastro e tentar `EDSON@example.com` com campos restantes válidos. | Alerta de e-mail já cadastrado; segunda conta não é criada. |
| CT-04 / RF-03 | Perfil limpo | Informar e-mail fictício inexistente e senha qualquer; clicar Entrar no painel. | Mensagem de credenciais incorretas; painel não aparece. |
| CT-05 / RF-03 | Perfil limpo | Na tela inicial, clicar Preencher e Entrar no painel. | Conta demo acessível e exatamente três chamados iniciais. |
| CT-06 / RF-05 | Login demo | Clicar Criar chamado sem preencher campos. | Erros de título, descrição e prioridade; total permanece em três. |
| CT-07 / RF-05, 08 | Login demo | Preencher título >=5, descrição >=10 e prioridade Alta; criar; recarregar. | Novo chamado Aberto; total sobe de três para quatro e permanece após recarga. |
| CT-08 / RF-06 | Login demo, três chamados iniciais | Buscar `intermitente`; filtrar Resolvido; limpar busca mantendo o filtro. | Primeiro um chamado, depois estado vazio, depois somente um resolvido. |
| CT-09 / RF-07, 08 | Login demo, três chamados iniciais | Alterar PD-001 de Aberto para Resolvido; recarregar. | Abertos caem para zero; resolvidos sobem para dois; status persistido. |
| CT-10 / RNF-01 | Login demo | Criar chamado com título `<img src=x onerror=alert(1)> solicitação`, descrição válida e prioridade Média. | O título é exibido literalmente; nenhuma imagem HTML é inserida e nenhum alerta é executado. |

## Registro de execução manual (preencher somente após executar)

| Campo | Preenchimento |
|---|---|
| Executor / data / SO / navegador | Não realizado |
| Versão ou commit | Não realizado |
| Caso e resultado (aprovado/reprovado/bloqueado) | Não realizado |
| Evidência (print, vídeo, bug real) | Não realizado |

**Exploratório sugerido:** teclado e tabulação, viewport mobile 375 px, limpar `localStorage` e `sessionStorage`, textos longos nos limites, combinações de filtro e busca. Esses cenários não possuem aprovação declarada. Reportar defeitos apenas quando reproduzidos e com evidências reais.
