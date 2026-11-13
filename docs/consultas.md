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

_Preencher com o SQL registrado no terminal após executar `npm run db:consultas`._

### 2. Obras cujo título contém "sertão"

**Objetivo:** localizar títulos que contenham a palavra "sertão", sem diferenciar letras maiúsculas e minúsculas.

**Implementação:**

```typescript
const resultado = await obras.find({
  where: { titulo: ILike('%sertão%') },
});
```

**SQL gerado:**

_Preencher após a execução._

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

_Preencher após a execução._

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

_Preencher após a execução._

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

_Preencher após a execução._

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

_Preencher após a execução._

### 7. Autores cujo nome começa com "Machado"

**Objetivo:** localizar autores cujos nomes começam com Machado.

**Implementação:**

```typescript
const resultado = await autores.find({
  where: { nome: ILike('Machado%') },
});
```

**SQL gerado:**

_Preencher após a execução._

### 8. Quantidade total de obras

**Objetivo:** obter a quantidade total de registros da tabela de obras.

**Implementação:**

```typescript
const quantidade = await obras.count();
```

**SQL gerado:**

_Preencher após a execução._

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

| Estratégia | Quantidade de consultas | Tempo |
|---|---:|---:|
| N+1 | Preencher após execução | Preencher após execução |
| Otimizada | Preencher após execução | Preencher após execução |

**Análise dos resultados:**

_Preencher após executar `npm run db:n1`, considerando a quantidade real de consultas SQL e os tempos registrados no terminal._

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
| LEFT JOIN + IS NULL | Preencher após execução | Preencher após execução |
| NOT IN | Preencher após execução | Preencher após execução |

**Análise:**

_Preencher após executar `npm run db:relatorios`, comparando os resultados e os tempos medidos._

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