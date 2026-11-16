
# E07 — Exercícios complementares da API

## E07.2 — Códigos HTTP

A tabela completa de situações, justificativas e diferenças entre 400 e 422 está documentada em `status-http.md`.

O HTTP 500 não deve expor detalhes internos porque informações sobre banco, SQL, arquivos, credenciais e stack traces podem facilitar ataques. Os detalhes técnicos devem ficar restritos aos logs internos.

## E07.7 — Limite de paginação e segurança

A rota de listagem de obras utiliza os parâmetros `pagina` e `tamanho`.

O tamanho máximo permitido é 100 registros, validado por DTO com `@Max(100)`.

Teste de limite:

```bash
curl -i "http://localhost:3000/obras?pagina=1&tamanho=100000"
```

Resultado esperado: HTTP 400 Bad Request.

O CI executa essa requisição e registra o tempo de resposta.

### Experimento controlado

Para observar o risco sem deixar a API desprotegida:

1. Em uma branch temporária, remova apenas o `@Max(100)` do DTO de paginação.
2. Compile e execute a API com banco de testes.
3. Faça a requisição com `tamanho=100000`.
4. Registre o tempo de resposta e o comportamento do banco.
5. Restaure imediatamente o `@Max(100)` e confirme que o teste retorna HTTP 400.

A ausência do limite pode provocar consultas excessivamente grandes, consumo elevado de memória, lentidão e sobrecarga do banco, permitindo abuso da API.

Não mantenha a versão sem limite na branch principal.

## E07.8 — Versionamento do OpenAPI

O arquivo `openapi.json` é gerado a partir dos decorators Swagger da aplicação.

O CI inicia a API, gera novamente a especificação e compara o resultado com o arquivo versionado.

Quando uma rota, campo ou resposta documentada é alterada, o arquivo gerado também muda. Se a atualização não for commitada, a comparação falha.

Esse processo mantém a documentação OpenAPI sincronizada com a implementação.
