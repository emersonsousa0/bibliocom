# Consultas ao Banco de Dados — BiblioCom

## 1. Objetivo

Este documento apresenta as consultas realizadas no banco de dados PostgreSQL do BiblioCom, utilizando TypeORM. São demonstradas consultas com Repository, o problema N+1 e consultas personalizadas com QueryBuilder.

## 2. Consultas utilizando Repository

As consultas abaixo utilizam os métodos do TypeORM para recuperar e filtrar informações do banco de dados.

| Nº | Consulta | Objetivo |
|---|---|---|
| 1 | Obras anteriores a 1900 | Buscar obras publicadas antes de 1900. |
| 2 | Obras com título contendo "sertão" | Realizar busca textual nos títulos. |
| 3 | Obras de Machado de Assis | Filtrar obras pelo autor. |
| 4 | Exemplares desgastados ou descartados | Filtrar exemplares por estado. |
| 5 | Obras sem ISBN | Identificar registros sem ISBN cadastrado. |
| 6 | Dez obras mais recentes | Ordenar obras por ano de publicação. |
| 7 | Autores com nome iniciado por "Machado" | Filtrar autores pelo início do nome. |
| 8 | Total de obras cadastradas | Contabilizar os registros de obras. |

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

A segunda implementação utiliza o método `find()` do Repository com o relacionamento `autor` carregado por meio de `relations`.

Essa abordagem reduz a quantidade de consultas necessárias. Na execução observada, o TypeORM gerou duas consultas SQL para carregar as obras e seus autores, utilizando uma consulta para selecionar os registros e outra para carregar os relacionamentos.

### 3.3. Comparação

| Implementação | Consultas SQL observadas |
|---|---:|
| Com problema N+1 (50 obras) | 51 |
| Otimizada com relacionamento | 2 |

A implementação otimizada reduz significativamente a quantidade de consultas ao banco de dados, evitando uma consulta individual para cada autor.

Os tempos de execução também são registrados pelo script, mas podem variar conforme o ambiente, a conexão e o estado do banco de dados.

## 4. Consultas utilizando QueryBuilder

O QueryBuilder permite construir consultas SQL personalizadas utilizando a API do TypeORM.

Foram implementados os seguintes relatórios:

1. Quantidade de obras por ano de publicação.
2. Quantidade de obras por autor.
3. Quantidade de exemplares por estado.
4. Quantidade de exemplares por obra.
5. Autores sem obras utilizando `LEFT JOIN` e `IS NULL`.
6. Autores sem obras utilizando `NOT IN`.

## 5. Resultados observados

Na base de demonstração, foram identificados:

- 9 autores cadastrados;
- 11 obras cadastradas no Neon;
- 10 exemplares cadastrados no Neon.

A base contém também uma edição atualizada de Dom Casmurro, além das obras previstas no seed.

## 6. Como executar as demonstrações

Os scripts devem ser executados em um ambiente compatível com a versão do Node.js e as dependências do projeto.

Comandos disponíveis:

```bash
npm run db:seed
npm run db:n1
npm run db:consultas
```

As consultas SQL e os resultados são apresentados no terminal durante a execução.

## 7. Conclusão

As consultas com Repository e QueryBuilder permitem recuperar e analisar os dados do BiblioCom de diferentes maneiras.

A demonstração do problema N+1 evidencia como consultas individuais para registros relacionados podem aumentar o número de operações no banco de dados. O carregamento dos relacionamentos pelo TypeORM reduz essa quantidade e melhora a eficiência do acesso aos dados.