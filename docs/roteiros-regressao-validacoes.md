# Casos manuais adicionais — regressão de validações

**Status:** roteiros elaborados, ainda não executados manualmente. O relato do nome numérico foi feito pelo usuário; a execução automatizada é evidência distinta. Usar perfil limpo e dados fictícios. Registrar executor, data, navegador, commit, resultado e captura para cada caso antes de marcar como executado.

| Caso | Pré-condição | Passos | Resultado esperado |
|---|---|---|---|
| CT-11 / RF-01 | Cadastro aberto, demais campos válidos | Tentar `Edson123`, `123 Edson`, `Edson 2 Silva`, depois `Ana-Maria D’Ávila`. | Os três primeiros exibem erro no nome e não criam conta; o último permite cadastro. |
| CT-12 / RF-01 | Cadastro aberto, demais campos válidos | Tentar `ana..silva@example.com`, `ana@-example.com` e `ANA+QA@EXAMPLE.COM`. | Os dois primeiros são rejeitados; o último é aceito. |
| CT-13 / RF-01 | Cadastro aberto, demais campos válidos | Senha de 129 caracteres com letras e números e confirmação igual. | Erro de limite superior; nenhuma conta criada. |
| CT-14 / RF-05 | Logado em demo num perfil limpo | Tentar título com 81 caracteres e descrição com 501; depois usar exatamente 80 e 500, com prioridade alta. | Primeiro envio não altera contador; segundo cria chamado e soma um. |

**Atenção:** aceitar a digitação de números no campo não significa aceitar o cadastro. A validação ocorre ao enviar e deve mostrar a mensagem junto ao campo. Conferir também via teclado, colar texto e mobile; estes cenários exploratórios adicionais não são declarados como aprovados.
