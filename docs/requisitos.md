# Requisitos e critérios de aceite — PulseDesk v1.0

> Escopo educacional: requisitos definidos para este laboratório, não derivados de um cliente real.

| ID | Requisito | Critério de aceite observável |
|---|---|---|
| RF-01 | Criar conta fictícia | Nome de 2–60 caracteres, e-mail válido, senha com 8+ caracteres (letras e números) e confirmação idêntica; cadastro válido cria conta e exibe sucesso. |
| RF-02 | Impedir duplicidade | E-mails equivalentes ignorando maiúsculas e espaços não são cadastrados novamente. |
| RF-03 | Autenticar | Credenciais válidas abrem painel; credenciais incorretas exibem erro, sem criar sessão. |
| RF-04 | Sessão | Recarregar a aba mantém sessão via `sessionStorage`; logout encerra sessão. |
| RF-05 | Abrir chamado | Título de 5–80 caracteres, descrição de 10–500 e prioridade Baixa/Média/Alta; novo registro nasce Aberto. |
| RF-06 | Listar, pesquisar e filtrar | Busca considera título, descrição e código; status pode ser combinado com busca. |
| RF-07 | Atualizar status | Somente Aberto, Em andamento ou Resolvido; alteração persistida. |
| RF-08 | Indicadores | Totais geral e por status refletem os chamados salvos. |
| RNF-01 | Renderização de texto | Texto digitado no chamado não deve executar HTML. |
| RNF-02 | Usabilidade | Labels associados, erros de validação visíveis e layout responsivo. |
| RNF-03 | Rastreabilidade | Os casos de teste devem mapear os requisitos correspondentes. |

## Fora do escopo

Aplicação exclusivamente frontend: sem API REST, banco remoto, recuperação de senha ou autorização de servidor. PBKDF2 local não transforma a autenticação em segura. Não usar dados pessoais, credenciais reais ou informações de clientes.