Consultas, desempenho e relatórios — BiblioCom
E06.1 — Consultas com Repository
As consultas abaixo utilizam os métodos do TypeORM (find, count) e os operadores LessThan, ILike, In e IsNull. Os valores de filtro são enviados como parâmetros, sem concatenar entrada do usuário diretamente no SQL.
Os trechos SQL estão normalizados para facilitar a leitura: nomes de aliases e colunas podem variar conforme a versão do TypeORM. Os parâmetros são apresentados separadamente.

1. Obras publicadas antes de 1900
TypeScript
const consulta1 = await obras.find({
  where: { anoPublicacao: LessThan(1900) },
  relations: { autor: true },
});
SQL
SELECT obra.*, autor.*
FROM obras obra
INNER JOIN autores autor ON autor.id = obra.autor_id
WHERE obra.ano_publicacao < $1;
-- PARAMETERS: [1900]
2. Obras com “sertão” no título (busca sem diferenciar maiúsculas/minúsculas)
TypeScript
const consulta2 = await obras.find({
  where: { titulo: ILike('%sertão%') },
  relations: { autor: true },
});
SQL
SELECT obra.*, autor.*
FROM obras obra
INNER JOIN autores autor ON autor.id = obra.autor_id
WHERE obra.titulo ILIKE $1;
-- PARAMETERS: ["%sertão%"]
3. Obras de Machado de Assis
TypeScript
const consulta3 = await obras.find({
  where: { autor: { nome: 'Machado de Assis' } },
  relations: { autor: true },
});
SQL
SELECT obra.*, autor.*
FROM obras obra
INNER JOIN autores autor ON autor.id = obra.autor_id
WHERE autor.nome = $1;
-- PARAMETERS: ["Machado de Assis"]
4. Exemplares desgastados ou descartados
TypeScript
const consulta4 = await exemplares.find({
  where: {
    estado: In([
      EstadoExemplar.DESGASTADO,
      EstadoExemplar.DESCARTADO,
    ]),
  },
  relations: { obra: true },
});
SQL
SELECT exemplar.*, obra.*
FROM exemplares exemplar
INNER JOIN obras obra ON obra.id = exemplar.obra_id
WHERE exemplar.estado IN ($1, $2);
-- PARAMETERS: ["DESGASTADO", "DESCARTADO"]
5. Obras sem ISBN
TypeScript
const consulta5 = await obras.find({
  where: { isbn: IsNull() },
  relations: { autor: true },
});
SQL
SELECT obra.*, autor.*
FROM obras obra
INNER JOIN autores autor ON autor.id = obra.autor_id
WHERE obra.isbn IS NULL;
6. Dez obras mais recentes
TypeScript
const consulta6 = await obras.find({
  relations: { autor: true },
  order: { anoPublicacao: 'DESC' },
  take: 10,
});
SQL
SELECT obra.*, autor.*
FROM obras obra
INNER JOIN autores autor ON autor.id = obra.autor_id
ORDER BY obra.ano_publicacao DESC
LIMIT 10;
7. Autores cujo nome começa com “Machado”
TypeScript
const consulta7 = await autores.find({
  where: { nome: ILike('Machado%') },
});
SQL
SELECT autor.*
FROM autores autor
WHERE autor.nome ILIKE $1;
-- PARAMETERS: ["Machado%"]
8. Quantidade total de obras
TypeScript
const consulta8 = await obras.count();
SQL
SELECT COUNT(1) AS "cnt"
FROM obras;
E06.2 — Demonstração do problema N+1
A demonstração consulta 50 obras e, na versão inicial, busca o autor individualmente para cada obra. Isso gera uma consulta inicial para as obras e mais uma consulta para cada autor. Na versão otimizada, a relação é carregada junto com as obras usando relations.
Implementação	Consultas ao banco	Tempo observado
Sem otimização (N+1)	51	54 ms
Com relação carregada (relations)	2	9 ms


Versão com N+1
const obrasEncontradas = await obraRepository.find({
  take: 50,
  order: { id: 'ASC' },
});

for (const obra of obrasEncontradas) {
  const autor = await autorRepository.findOneBy({
    id: obra.autorId,
  });
  // associação do autor à obra para a resposta
}
Versão otimizada
const obrasEncontradas = await obraRepository.find({
  take: 50,
  order: { id: 'ASC' },
  relations: { autor: true },
});
A redução observada foi de 49 consultas, aproximadamente 96,1%. O tempo também caiu de 54 ms para 9 ms no teste registrado.

O problema N+1 pode passar despercebido em uma revisão porque o código parece simples: primeiro lista os registros e depois busca os dados relacionados dentro de um laço. Com poucos registros, a lentidão pode não ser perceptível. Quando o volume cresce, cada iteração adiciona uma ida ao banco. Carregar a relação em conjunto reduz essas chamadas e torna o comportamento mais previsível.

Sobre linhas de código: a contagem depende de considerar ou não comentários, chaves e linhas em branco. A comparação principal desta execução foi feita por quantidade de consultas e tempo, que são as métricas registradas no teste.
E06.3 — Relatórios com QueryBuilder
Os relatórios utilizam createQueryBuilder, agregações (COUNT), agrupamentos (GROUP BY) e junções (LEFT JOIN).
1. Quantidade de obras por ano de publicação
TypeScript
const relatorio1 = await obras
  .createQueryBuilder('obra')
  .select('obra.anoPublicacao', 'ano')
  .addSelect('COUNT(obra.id)', 'quantidade')
  .groupBy('obra.anoPublicacao')
  .orderBy('obra.anoPublicacao', 'DESC')
  .getRawMany();
SQL
SELECT obra.ano_publicacao AS ano,
       COUNT(obra.id) AS quantidade
FROM obras obra
GROUP BY obra.ano_publicacao
ORDER BY obra.ano_publicacao DESC;
2. Quantidade de obras por autor
TypeScript
const relatorio2 = await autores
  .createQueryBuilder('autor')
  .leftJoin('autor.obras', 'obra')
  .select('autor.id', 'autorId')
  .addSelect('autor.nome', 'autor')
  .addSelect('COUNT(obra.id)', 'quantidade')
  .groupBy('autor.id')
  .addGroupBy('autor.nome')
  .orderBy('quantidade', 'DESC')
  .getRawMany();
SQL
SELECT autor.id AS "autorId",
       autor.nome AS autor,
       COUNT(obra.id) AS quantidade
FROM autores autor
LEFT JOIN obras obra ON obra.autor_id = autor.id
GROUP BY autor.id, autor.nome
ORDER BY quantidade DESC;
3. Quantidade de exemplares por estado
TypeScript
const relatorio3 = await exemplares
  .createQueryBuilder('exemplar')
  .select('exemplar.estado', 'estado')
  .addSelect('COUNT(exemplar.id)', 'quantidade')
  .groupBy('exemplar.estado')
  .getRawMany();
SQL
SELECT exemplar.estado AS estado,
       COUNT(exemplar.id) AS quantidade
FROM exemplares exemplar
GROUP BY exemplar.estado;
4. Obras, autores e quantidade de exemplares
TypeScript
const relatorio4 = await obras
  .createQueryBuilder('obra')
  .leftJoin('obra.autor', 'autor')
  .leftJoin('obra.exemplares', 'exemplar')
  .select('obra.id', 'obraId')
  .addSelect('obra.titulo', 'titulo')
  .addSelect('autor.nome', 'autor')
  .addSelect('COUNT(exemplar.id)', 'quantidadeExemplares')
  .groupBy('obra.id')
  .addGroupBy('obra.titulo')
  .addGroupBy('autor.nome')
  .orderBy('obra.titulo', 'ASC')
  .getRawMany();
SQL
SELECT obra.id AS "obraId",
       obra.titulo AS titulo,
       autor.nome AS autor,
       COUNT(exemplar.id) AS "quantidadeExemplares"
FROM obras obra
LEFT JOIN autores autor ON autor.id = obra.autor_id
LEFT JOIN exemplares exemplar ON exemplar.obra_id = obra.id
GROUP BY obra.id, obra.titulo, autor.nome
ORDER BY obra.titulo ASC;
5. Autores sem obras — LEFT JOIN / IS NULL
TypeScript
const relatorio5 = await autores
  .createQueryBuilder('autor')
  .leftJoin('autor.obras', 'obra')
  .where('obra.id IS NULL')
  .getMany();
SQL
SELECT autor.*
FROM autores autor
LEFT JOIN obras obra ON obra.autor_id = autor.id
WHERE obra.id IS NULL;
6. Autores sem obras — NOT IN
TypeScript
const relatorio6 = await autores
  .createQueryBuilder('autor')
  .where(
    'autor.id NOT IN ' +
      '(SELECT obra.autor_id FROM obras obra)',
  )
  .getMany();
SQL
SELECT autor.*
FROM autores autor
WHERE autor.id NOT IN (
  SELECT obra.autor_id
  FROM obras obra
);
Comparação das duas estratégias
Na execução registrada, as duas consultas retornaram 1 autor sem obras.
Estratégia	Registros encontrados	Tempo observado
LEFT JOIN + IS NULL	1	5 ms
NOT IN	1	2 ms


Os tempos são medidas pontuais da execução e podem variar conforme volume de dados, índices, cache e carga do banco. As duas estratégias atendem ao objetivo do relatório; a escolha deve considerar legibilidade, comportamento com valores nulos e plano de execução.
Segurança e parâmetros
Os filtros das consultas Repository são construídos com operadores do TypeORM, que enviam os valores separadamente dos comandos SQL. Nos casos com QueryBuilder, os filtros que recebem valores externos devem usar parâmetros nomeados (por exemplo, :termo) em vez de concatenar texto recebido do usuário ao SQL.
Como executar as demonstrações
Com a variável DATABASE_URL configurada no ambiente:
npm run db:consultas
npm run db:n1
npm run db:relatorios
As saídas do TypeORM permitem acompanhar os comandos SQL e os parâmetros enviados ao PostgreSQL.