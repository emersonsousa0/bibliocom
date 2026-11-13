# E06 — Consultas e relatórios com TypeORM

## E06.1 — Consultas com Repository

As consultas abaixo foram implementadas utilizando os métodos do Repository do TypeORM.

### 1. Obras publicadas antes de 1900

**Objetivo:** localizar obras publicadas antes do ano 1900.

**Implementação:**

```typescript
const resultado = await obras.find({
  where: { anoPublicacao: LessThan(1900) },
  relations: { autor: true },
});
```

**SQL gerado:**


SELECT "Obra"."id", "Obra"."titulo", "Obra"."isbn",
       "Obra"."ano_publicacao", "Obra"."autor_id",
       "Obra__Obra_autor"."id", "Obra__Obra_autor"."nome"
FROM "obras" "Obra"
INNER JOIN "autores" "Obra__Obra_autor"
ON "Obra__Obra_autor"."id" = "Obra"."autor_id"
WHERE "Obra"."ano_publicacao" < $1;
-- PARAMETERS: [1900]

### 2. Obras cujo título contém "sertão"

**Objetivo:** localizar títulos que contenham a palavra "sertão", sem diferenciar letras maiúsculas e minúsculas.

**Implementação:**

```typescript
const resultado = await obras.find({
  where: { titulo: ILike('%sertão%') },
});
```

**SQL gerado:**

SELECT "Obra"."id", "Obra"."titulo", "Obra"."isbn",
       "Obra"."ano_publicacao", "Obra"."autor_id",
       "Obra__Obra_autor"."id", "Obra__Obra_autor"."nome"
FROM "obras" "Obra"
INNER JOIN "autores" "Obra__Obra_autor"
ON "Obra__Obra_autor"."id" = "Obra"."autor_id"
WHERE "Obra"."titulo" ILIKE $1;
-- PARAMETERS: ["%sertão%"]

### 3. Obras de Machado de Assis

**Objetivo:** buscar obras relacionadas ao autor Machado de Assis, carregando também os dados do autor.

**Implementação:**

```typescript
const resultado = await obras.find({
  where: { autor: { nome: 'Machado de Assis' } },
  relations: { autor: true },
});
```

**SQL gerado:**

SELECT "Obra"."id", "Obra"."titulo", "Obra"."isbn",
       "Obra"."ano_publicacao", "Obra"."autor_id",
       "Obra__Obra_autor"."id", "Obra__Obra_autor"."nome"
FROM "obras" "Obra"
INNER JOIN "autores" "Obra__Obra_autor"
ON "Obra__Obra_autor"."id" = "Obra"."autor_id"
WHERE "Obra__Obra_autor"."nome" = $1;
-- PARAMETERS: ["Machado de Assis"]

### 4. Exemplares desgastados ou descartados

**Objetivo:** localizar exemplares nos estados DESGASTADO ou DESCARTADO.

**Implementação:**

```typescript
const resultado = await exemplares.find({
  where: {
    estado: In([
      EstadoExemplar.DESGASTADO,
      EstadoExemplar.DESCARTADO,
    ]),
  },
  relations: { obra: true },
});
```

**SQL gerado:**

SELECT "Exemplar"."id", "Exemplar"."tombo",
       "Exemplar"."estado", "Exemplar"."data_aquisicao",
       "Exemplar"."obra_id",
       "Exemplar__Exemplar_obra"."id",
       "Exemplar__Exemplar_obra"."titulo",
       "Exemplar__Exemplar_obra"."isbn",
       "Exemplar__Exemplar_obra"."ano_publicacao",
       "Exemplar__Exemplar_obra"."autor_id"
FROM "exemplares" "Exemplar"
INNER JOIN "obras" "Exemplar__Exemplar_obra"
ON "Exemplar__Exemplar_obra"."id" = "Exemplar"."obra_id"
WHERE "Exemplar"."estado" IN ($1, $2);
-- PARAMETERS: ["DESGASTADO", "DESCARTADO"]

### 5. Obras sem ISBN

**Objetivo:** localizar obras cujo ISBN não foi informado.

**Implementação:**

```typescript
const resultado = await obras.find({
  where: { isbn: IsNull() },
  relations: { autor: true },
});
```

**SQL gerado:**

SELECT "Obra"."id", "Obra"."titulo", "Obra"."isbn",
       "Obra"."ano_publicacao", "Obra"."autor_id",
       "Obra__Obra_autor"."id", "Obra__Obra_autor"."nome"
FROM "obras" "Obra"
INNER JOIN "autores" "Obra__Obra_autor"
ON "Obra__Obra_autor"."id" = "Obra"."autor_id"
WHERE "Obra"."isbn" IS NULL;

### 6. Dez obras mais recentes

**Objetivo:** listar as dez obras com publicação mais recente.

**Implementação:**

```typescript
const resultado = await obras.find({
  take: 10,
  order: { anoPublicacao: 'DESC' },
});
```

**SQL gerado:**

SELECT DISTINCT "distinctAlias"."Obra_id",
       "distinctAlias"."Obra_ano_publicacao"
FROM (
  SELECT "Obra"."id" AS "Obra_id",
         "Obra"."ano_publicacao" AS "Obra_ano_publicacao"
  FROM "obras" "Obra"
  INNER JOIN "autores" "Obra__Obra_autor"
  ON "Obra__Obra_autor"."id" = "Obra"."autor_id"
) "distinctAlias"
ORDER BY "distinctAlias"."Obra_ano_publicacao" DESC,
         "Obra_id" ASC
LIMIT 10;


### 7. Autores cujo nome começa com "Machado"

**Objetivo:** localizar autores cujos nomes começam com Machado.

**Implementação:**

```typescript
const resultado = await autores.find({
  where: { nome: ILike('Machado%') },
});
```

**SQL gerado:**

SELECT "Autor"."id", "Autor"."nome"
FROM "autores" "Autor"
WHERE "Autor"."nome" ILIKE $1;
-- PARAMETERS: ["Machado%"]

### 8. Quantidade total de obras

**Objetivo:** obter a quantidade total de registros da tabela de obras.

**Implementação:**

```typescript
const quantidade = await obras.count();
```

**SQL gerado:**

SELECT COUNT(1) AS "cnt"
FROM "obras" "Obra";
---

## E06.2 — Problema N+1

O problema N+1 acontece quando uma consulta inicial busca uma lista de registros e, em seguida, uma nova consulta é realizada individualmente para cada registro relacionado.

Na implementação deste projeto, primeiro são listadas as obras e depois é feita uma consulta para buscar o autor de cada uma.

### Implementação com N+1

Arquivo: `src/database/n1.ts`.

A estratégia realiza uma consulta inicial para buscar as obras e uma consulta adicional para cada autor relacionado.

### Implementação otimizada

A solução utiliza o carregamento da relação com `relations`, permitindo buscar as obras e seus autores juntos.

```typescript
const obras = await obrasRepository.find({
  take: 50,
  order: { id: 'ASC' },
  relations: {
    autor: true,
  },
});
```

### Comparação de desempenho

Foram utilizadas 50 obras para comparar as duas estratégias.

| Estratégia | Quantidade de consultas SQL | Tempo |
|---|---:|---:|
| N+1 | 51 | 12.442 ms |
| Otimizada | 2 | 660 ms |

**Análise dos resultados:**

A implementação N+1 realizou 51 consultas SQL: uma consulta inicial para buscar as 50 obras e outras 50 consultas individuais para buscar seus autores. O tempo registrado foi de 12.442 ms.

Já a implementação otimizada utilizou o carregamento da relação com `relations`, realizando 2 consultas SQL e levando 660 ms.

Nesta execução, a implementação otimizada foi aproximadamente 18,9 vezes mais rápida, demonstrando como reduzir consultas individuais pode melhorar o desempenho da aplicação.
---

## E06.3 — Relatórios com QueryBuilder

Os relatórios foram implementados utilizando o QueryBuilder do TypeORM.

1. Quantidade de obras por ano de publicação.
2. Quantidade de obras por autor.
3. Quantidade de exemplares por estado.
4. Obras com seus autores e quantidade de exemplares.
5. Autores sem obras utilizando `LEFT JOIN` e `IS NULL`.
6. Autores sem obras utilizando `NOT IN` com subconsulta.

### Comparação: LEFT JOIN × NOT IN

As consultas 5 e 6 possuem o mesmo objetivo, mas utilizam estratégias SQL diferentes.

- `LEFT JOIN` com `IS NULL` identifica autores que não possuem obras relacionadas.
- `NOT IN` utiliza uma subconsulta para excluir os autores que aparecem na tabela de obras.

**Resultados e tempos:**

| Estratégia | Autores encontrados | Tempo |
|---|---:|---:|
| LEFT JOIN + IS NULL | 0 | 308 ms |
| NOT IN | 0 | 221 ms |

**Análise:**

As duas consultas retornaram o mesmo resultado: nenhum autor sem obras cadastradas. A consulta utilizando LEFT JOIN + IS NULL apresentou tempo de 308 ms, enquanto a consulta com NOT IN apresentou 221 ms. Nesta execução, NOT IN foi mais rápida, mas essa diferença não significa que será sempre a melhor opção, pois o desempenho depende dos dados e do ambiente de execução.
---

## Observação sobre a execução

O projeto utiliza TypeORM com PostgreSQL e logging SQL habilitado.

Os comandos utilizados para executar as consultas são:

```bash
npm run db:consultas
npm run db:n1
npm run db:relatorios
```

Os comandos devem ser executados com o banco de dados acessível. Os SQLs e tempos apresentados neste documento devem corresponder aos resultados reais da execução.