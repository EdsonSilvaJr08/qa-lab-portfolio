# Requisitos e critérios de aceite — PulseDesk

> Regras definidas para um laboratório educacional, não derivadas de clientes ou sistemas reais. As alterações de validação de 21/09/2026 estão detalhadas em [auditoria-validacoes.md](auditoria-validacoes.md).

| ID | Requisito | Critério de aceite observável |
|---|---|---|
| RF-01 | Criar conta fictícia | Nome de 2–60 caracteres após normalizar espaços, com letras Unicode, espaços, hífen ou apóstrofo; rejeitar números e demais símbolos **ao enviar**. E-mail em formato comum ASCII, até 254 caracteres e com domínio válido; senha de 8–128 caracteres com letra e dígito; confirmação idêntica. Cadastro válido exibe sucesso. A regra do nome é específica deste laboratório, não universal. |
| RF-02 | Impedir duplicidade | E-mails equivalentes ignorando maiúsculas e espaços não são cadastrados novamente, inclusive em tentativas simultâneas da mesma aba. |
| RF-03 | Autenticar | Credenciais válidas abrem painel; incorretas exibem erro, sem criar sessão. |
| RF-04 | Sessão | Recarregar a aba mantém sessão via `sessionStorage`; logout encerra sessão. |
| RF-05 | Abrir chamado | Título de 5–80 caracteres, descrição de 10–500 e prioridade Baixa/Média/Alta; novo registro nasce Aberto. |
| RF-06 | Listar, pesquisar e filtrar | Busca considera título, descrição e código; status pode ser combinado com busca. |
| RF-07 | Atualizar status | Somente Aberto, Em andamento ou Resolvido; alteração persistida. |
| RF-08 | Indicadores | Totais geral e por status refletem os chamados salvos. |
| RNF-01 | Renderização de texto | Texto digitado no chamado não deve executar HTML; registros locais corrompidos ou com valores de status/prioridade desconhecidos são ignorados na leitura. |
| RNF-02 | Usabilidade | Labels associados, erros de validação visíveis ao enviar e layout responsivo. |
| RNF-03 | Rastreabilidade | Casos de teste devem mapear os requisitos correspondentes. |

## Fora do escopo

Aplicação exclusivamente frontend: sem API REST, banco remoto, recuperação de senha, autorização de servidor ou garantia de dados compartilhados entre visitantes. PBKDF2 local não transforma a autenticação em segura. Não usar dados pessoais, credenciais reais ou informações de clientes. A validação de e-mail atende ao formato comum do laboratório, não a todos os endereços permitidos pela RFC 5322. Dados cadastrados anteriormente não são migrados nem excluídos automaticamente.
