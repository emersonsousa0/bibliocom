# Consultas ao Banco de Dados — BiblioCom

## 1. Objetivo

Este documento apresenta as consultas realizadas no banco de dados PostgreSQL do BiblioCom, utilizando TypeORM. São demonstradas consultas com Repository, o problema N+1 e consultas personalizadas com QueryBuilder.

## 2. Consultas utilizando Repository

As consultas utilizam os métodos do TypeORM para recuperar, filtrar, ordenar e contabilizar informações do banco de dados.

| Nº | Consulta | Objetivo |
|---|---|---|
| 1 | Obras anteriores a 1900 | Buscar obras publicadas antes de 1900, incluindo seus autores. |
| 2 | Obras com título contendo "sertão" | Realizar busca textual sem diferenciar maiúsculas e minúsculas. |
| 3 | Obras de Machado de Assis | Filtrar obras pelo nome do autor. |
| 4 | Exemplares desgastados ou descartados | Filtrar exemplares pelos estados informados. |
| 5 | Obras sem ISBN | Identificar registros sem ISBN cadastrado. |
| 6 | Dez obras mais recentes | Ordenar obras pelo ano de publicação em ordem decrescente e limitar o resultado a dez registros. |
| 7 | Autores com nome iniciado por "Machado" | Filtrar autores pelo início do nome. |
| 8 | Total de obras cadastradas | Contabilizar os registros de obras. |

### Recursos do TypeORM utilizados

- `LessThan`: comparação de valores menores que o informado.
- `ILike`: busca textual sem diferenciar maiúsculas e minúsculas.
- `In`: consulta com múltiplos valores possíveis.
- `IsNull`: identificação de campos sem valor.
- `relations`: carregamento de entidades relacionadas.
- `order` e `take`: ordenação e limitação dos resultados.
- `count`: contagem de registros.

## 3. Demonstração do problema N+1

O problema N+1 acontece quando uma consulta inicial recupera vários registros e, em seguida, uma nova consulta é executada individualmente para cada registro relacionado.

No BiblioCom, o exemplo utiliza obras e seus respectivos autores.

### 3.1. Implementação com problema N+1

Primeiro, o sistema busca até 50 obras. Depois, executa uma consulta individual para localizar o autor de cada obra.

Considerando 50 obras:

- 1 consulta para recuperar as obras;
- 50 consultas para recuperar os autores;
- Total: 51 consultas SQL.

### 3.2. Implementação otimizada

A implementação otimizada utiliza o método `find()` do Repository com o relacionamento `autor` carregado por meio de `relations`.

Dessa forma, o TypeORM recupera as obras e seus autores sem executar uma consulta individual para cada registro.

### 3.3. Comparação dos resultados

Na execução do script `n1.ts`, considerando 50 obras, foram observados os seguintes resultados:

| Implementação | Consultas SQL | Tempo observado |
|---|---:|---:|
| Com problema N+1 | 51 | 35 ms |
| Otimizada com relacionamento | 2 | 5 ms |

A implementação otimizada reduziu a quantidade de consultas de 51 para 2, além de apresentar menor tempo de execução nessa demonstração.

Os tempos podem variar conforme o ambiente, a conexão e o estado do banco de dados.

## 4. Consultas utilizando QueryBuilder

O QueryBuilder permite construir consultas SQL personalizadas utilizando a API do TypeORM.

Foram implementados seis relatórios:

1. Quantidade de obras por ano de publicação, utilizando agrupamento e contagem.
2. Quantidade de obras por autor, relacionando autores e obras.
3. Quantidade de exemplares por estado.
4. Relação de obras com seus autores e a quantidade de exemplares.
5. Autores sem obras utilizando `LEFT JOIN` e `IS NULL`.
6. Autores sem obras utilizando `NOT IN` com uma subconsulta.

### 4.1. Comparação de estratégias SQL

Para identificar autores que não possuem obras cadastradas, foram implementadas duas abordagens:

- `LEFT JOIN` com `IS NULL`;
- `NOT IN` com uma subconsulta.

Na execução registrada, as duas abordagens retornaram um autor sem obras:

| Estratégia | Registros encontrados | Tempo observado |
|---|---:|---:|
| `LEFT JOIN` + `IS NULL` | 1 | 3 ms |
| `NOT IN` | 1 | 2 ms |

Os resultados demonstram que as duas estratégias podem resolver essa consulta. A diferença de tempo observada é pequena e não representa, isoladamente, uma conclusão geral de desempenho.

## 5. Resultados observados

Na execução dos scripts no ambiente de demonstração, foram registrados:

- 510 obras contabilizadas na consulta de total de obras;
- 50 obras utilizadas na demonstração do N+1;
- 51 consultas SQL na implementação não otimizada;
- 2 consultas SQL na implementação otimizada;
- 1 autor sem obras encontrado nas duas estratégias de consulta do QueryBuilder.

A quantidade de 510 obras corresponde ao ambiente de demonstração com os dados do seed principal e do seed de volume. Ela não deve ser interpretada como a quantidade permanente de obras cadastradas no banco de produção.

Os resultados e tempos podem mudar conforme os dados existentes no banco e o ambiente de execução.

## 6. Scripts e execução

Os scripts responsáveis pelas demonstrações estão localizados em `src/database/`:

| Arquivo | Responsabilidade |
|---|---|
| `consultas.ts` | Executa as consultas utilizando Repository. |
| `n1.ts` | Compara a implementação com problema N+1 e a otimizada. |
| `relatorios.ts` | Executa os relatórios utilizando QueryBuilder. |
| `seed.ts` | Insere os dados principais de demonstração. |
| `seed-volume.ts` | Insere dados adicionais para testes de volume. |

Comandos disponíveis:

```bash
npm run db:seed
npm run db:consultas
npm run db:n1
npm run db:relatorios
```

Para preparar uma base com dados adicionais de demonstração, também pode ser executado o seed de volume, conforme o script e o comando configurados no projeto.

As consultas SQL, os resultados e os tempos observados são apresentados no terminal durante a execução.

## 7. Conclusão

As consultas com Repository e QueryBuilder permitem recuperar, filtrar e analisar os dados do BiblioCom de diferentes maneiras.

A demonstração do problema N+1 evidencia como consultas individuais para registros relacionados podem aumentar o número de operações no banco de dados. O carregamento dos relacionamentos pelo TypeORM reduz essa quantidade e melhora a eficiência do acesso aos dados.

Os relatórios com QueryBuilder também demonstram o uso de agrupamentos, junções, subconsultas e funções de agregação para produzir informações a partir dos dados cadastrados.