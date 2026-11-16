
# E07 — Exemplos de requisições HTTP

API: `http://localhost:3000`

Os exemplos utilizam a rota de exemplares. É necessário ter uma obra cadastrada no banco.

## 1. Criar exemplar — 201 Created

```bash
curl -i -X POST http://localhost:3000/exemplares \
  -H "Content-Type: application/json" \
  -d '{
    "tombo": "EX-DEMO-001",
    "estado": "DISPONIVEL",
    "dataAquisicao": "2025-03-15",
    "obraId": 1
  }'
```

Resultado esperado: HTTP 201, com os dados do exemplar criado e o título da obra relacionada.

## 2. Excluir exemplar — 204 No Content

Substitua `ID_RETORNADO` pelo ID recebido na criação:

```bash
curl -i -X DELETE http://localhost:3000/exemplares/ID_RETORNADO
```

Resultado esperado: HTTP 204, sem corpo de resposta.

## 3. Dados inválidos — 400 Bad Request

O tombo contém caracteres não permitidos:

```bash
curl -i -X POST http://localhost:3000/exemplares \
  -H "Content-Type: application/json" \
  -d '{
    "tombo": "ex@001",
    "estado": "DISPONIVEL",
    "dataAquisicao": "2025-03-15",
    "obraId": 1
  }'
```

Resultado esperado: HTTP 400, indicando falha na validação do DTO.

## 4. Recurso inexistente — 404 Not Found

Utilize um ID que não exista:

```bash
curl -i http://localhost:3000/exemplares/999999
```

Resultado esperado: HTTP 404.

## 5. Conflito de cadastro — 409 Conflict

Execute duas vezes a mesma requisição de criação, mantendo o mesmo tombo:

```bash
curl -i -X POST http://localhost:3000/exemplares \
  -H "Content-Type: application/json" \
  -d '{
    "tombo": "EX-DEMO-002",
    "estado": "DISPONIVEL",
    "dataAquisicao": "2025-03-15",
    "obraId": 1
  }'
```

A primeira execução deve retornar HTTP 201. A segunda deve retornar HTTP 409, pois o número de tombo já estará cadastrado.

## 6. Diferença entre 400 e 422

O HTTP 400 representa problemas na estrutura ou validação da requisição, como campos obrigatórios ausentes, tipos incorretos ou valores fora dos limites.

O HTTP 422 representa uma requisição estruturalmente válida que viola uma regra de negócio. Por exemplo, uma operação que não pode ser realizada devido a uma condição específica do domínio.

No BiblioCom, a validação dos DTOs utiliza HTTP 400 e o conflito de tombo duplicado utiliza HTTP 409.

## 7. Segurança do HTTP 500

O HTTP 500 representa uma falha inesperada no servidor. A API não deve expor ao cliente detalhes internos como SQL, caminhos de arquivos, credenciais ou stack traces.

Esses detalhes devem permanecer nos logs internos, protegidos contra acesso indevido.
