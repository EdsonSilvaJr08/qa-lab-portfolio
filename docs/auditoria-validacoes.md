# Auditoria de validações e regressão — 21/09/2026

> Escopo: aplicação educacional PulseDesk, sem backend. Este relatório distingue observação, correção implementada, automação e execução manual. Nenhum defeito adicional é declarado como reproduzido manualmente.

## Defeito reportado: caracteres numéricos no nome

- **Origem:** usuário identificou que era possível cadastrar um nome com números na interface pública.
- **Causa confirmada por inspeção:** `validateRegistration` verificava somente comprimento entre 2 e 60; não validava caracteres.
- **Decisão de requisito para o laboratório:** nomes de 2–60 caracteres normalizados, contendo letras Unicode (inclusive acentos), espaços simples, hífen e apóstrofos. Números, emojis, HTML e símbolos fora da lista são rejeitados **no envio do formulário**, com mensagem ao lado do campo. Essa não é uma regra universal sobre nomes civis; trata-se de uma regra explícita desta aplicação fictícia. Não bloquear teclas durante a digitação, para permitir copiar/colar e acessibilidade.
- **Correção:** função de domínio `validateRegistration` + validação independente em `registerUser`. Testes de regressão `CT-11` e testes unitários específicos.
- **Dados existentes:** usuários inválidos que já tenham sido gravados antes da atualização não são alterados ou excluídos automaticamente. Novos cadastros devem seguir a regra.

## Revisão de outros campos

| Área | Achado por inspeção | Medida | Verificação adicionada |
|---|---|---|---|
| E-mail | Regex permissiva aceitava pontos consecutivos, pontos nas extremidades da parte local e hífens inválidos em rótulos do domínio. | Verificador limitado a formatos de e-mail comuns ASCII, com limites de comprimento, domínio e parte local; mantém aliases `+` e subdomínios. Não pretende implementar todo RFC 5322. | Testes unitários + CT-12. |
| Senha | Havia mínimo de 8 caracteres, sem limite superior; letra apenas ASCII. | Limite de 8–128 caracteres, contendo uma letra Unicode e um dígito, como regra do laboratório. | Testes unitários + CT-13. |
| Camada de persistência | `registerUser` aceitava dados se chamada diretamente, sem `validateRegistration`; havia intervalo assíncrono antes da gravação em que uma duplicidade poderia ocorrer. | Revalidar entrada na função de cadastro e conferir unicidade novamente antes de persistir. | Testes unitários de acesso direto e chamadas simultâneas. |
| Dados locais modificados | Chamados do `localStorage` eram devolvidos sem validar os tipos/valores; prioridade era interpolada em classe CSS. | Ignorar registros inválidos ao ler; aceitar só prioridades/status previstos e datas válidas. | Testes unitários de registro corrompido/injeção. |
| Chamados | Comprimentos e prioridade já eram validados; faltavam testes completos dos limites. | Manter regra existente e testar exatamente os extremos e além deles. | Testes unitários + CT-14. |

## Áreas inspecionadas sem alteração nesta entrega

- Login: erros por campo, credencial incorreta, logout e sessão em aba; manter testes existentes CT-01, CT-04 e CT-05.
- Chamados: criação, persistência, filtros, transição de status e indicadores; manter CT-06 a CT-09.
- HTML no título: exibição como texto, coberta por CT-10. Não confundir esse teste com auditoria de segurança completa.
- Servidor estático, rotas e métodos: manter testes HTTP existentes.

## Execução e limitações

Os cenários automatizados são um recorte de regressão, não a garantia de ausência de bugs. O resultado de cada execução deve ser verificado no [workflow de QA](https://github.com/EdsonSilvaJr08/qa-lab-portfolio/actions/workflows/qa.yml), associado ao commit correspondente. **Não contar novos testes como aprovados antes de a CI terminar.** Os casos manuais são roteiros, e o relato original veio do usuário; não há execução manual integral declarada por este relatório. O PulseDesk não tem autenticação real no servidor, backend ou banco remoto, e não deve receber dados reais.
