# E07.2 — Documentação dos códigos HTTP

## Objetivo

Documentar os códigos HTTP utilizados pela API BiblioCom, apresentando as situações em que cada resposta deve ser retornada e sua justificativa.

## Tabela de situações

| Código | Situação | Justificativa |
|---|---|---|
| 200 OK | Consulta ou atualização realizada com sucesso. | Indica que a operação foi concluída e os dados foram retornados. |
| 201 Created | Autor, obra ou exemplar cadastrado com sucesso. | Indica que um novo recurso foi criado. |
| 204 No Content | Exclusão realizada com sucesso. | A operação foi concluída sem necessidade de retornar conteúdo. |
| 400 Bad Request | Dados inválidos, campos inesperados ou parâmetros de paginação incorretos. | A solicitação apresenta problemas de validação ou formato. |
| 404 Not Found | Autor, obra ou exemplar não encontrado. | O recurso solicitado não existe ou não foi localizado. |
| 409 Conflict | Tentativa de cadastrar exemplar com número de tombo já utilizado. | A operação entra em conflito com uma restrição de unicidade existente. |
| 422 Unprocessable Entity | Dados possuem formato válido, mas violam uma regra de negócio. | A solicitação pode ser interpretada, mas não pode ser processada por uma regra específica do domínio. |
| 500 Internal Server Error | Erro inesperado durante o processamento da solicitação. | Indica uma falha interna que não deve ser exposta ao cliente em detalhes. |
| 503 Service Unavailable | Banco de dados ou serviço necessário temporariamente indisponível. | Indica que a API não consegue atender à solicitação naquele momento. |

## Justificativa: 400 Bad Request e 422 Unprocessable Entity

O código 400 é utilizado quando a requisição apresenta problemas de validação, como campos obrigatórios ausentes, tipos incorretos, valores fora dos limites permitidos ou propriedades não autorizadas.

O código 422 é mais adequado quando a requisição possui estrutura e tipos válidos, mas não pode ser executada por uma regra de negócio específica.

Por exemplo, uma operação pode apresentar dados corretamente formatados, mas ser incompatível com uma condição de negócio estabelecida pelo sistema.

## Por que o erro 500 não deve expor detalhes internos?

A resposta 500 deve apresentar uma mensagem genérica ao cliente, sem revelar informações como:

- Consultas SQL executadas;
- Estrutura interna do banco de dados;
- Caminhos de arquivos do servidor;
- Variáveis de ambiente;
- Senhas, tokens ou credenciais;
- Rastreamentos completos de exceções (stack traces).

Essas informações podem facilitar ataques e comprometer a segurança da aplicação.

Os detalhes técnicos devem ser registrados nos logs internos, com acesso restrito aos responsáveis pela manutenção.

## Observação sobre a implementação

Os códigos HTTP documentados representam os comportamentos esperados da API. A ocorrência efetiva de cada resposta deve ser confirmada por meio de testes das rotas.

A API utiliza o `ValidationPipe` global com `whitelist` e `forbidNonWhitelisted`, além de exceções do NestJS para tratar situações como recursos inexistentes e conflitos de dados.