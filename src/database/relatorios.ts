
import 'reflect-metadata';
import 'dotenv/config';

import { AppDataSource } from './data-source.js';
import { Autor } from '../autores/entities/autor.entity.js';
import { Obra } from '../obras/entities/obra.entity.js';
import { Exemplar } from '../exemplares/entities/exemplar.entity.js';

async function executarRelatorios() {
  try {
    await AppDataSource.initialize();

    const autores = AppDataSource.getRepository(Autor);
    const obras = AppDataSource.getRepository(Obra);
    const exemplares = AppDataSource.getRepository(Exemplar);

    console.log('\n========== E06.3 - RELATÓRIOS QUERYBUILDER ==========\n');

    // 1. Obras agrupadas por ano de publicação.
    console.log('\n1. Quantidade de obras por ano');

    const relatorio1 = await obras
      .createQueryBuilder('obra')
      .select('obra.anoPublicacao', 'ano')
      .addSelect('COUNT(obra.id)', 'quantidade')
      .groupBy('obra.anoPublicacao')
      .orderBy('obra.anoPublicacao', 'DESC')
      .getRawMany();

    console.log(relatorio1);

    // 2. Autores e quantidade de obras.
    console.log('\n2. Quantidade de obras por autor');

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

    console.log(relatorio2);

    // 3. Exemplares agrupados por estado.
    console.log('\n3. Quantidade de exemplares por estado');

    const relatorio3 = await exemplares
      .createQueryBuilder('exemplar')
      .select('exemplar.estado', 'estado')
      .addSelect('COUNT(exemplar.id)', 'quantidade')
      .groupBy('exemplar.estado')
      .getRawMany();

    console.log(relatorio3);

    // 4. Obras, autores e quantidade de exemplares.
    console.log('\n4. Obras com quantidade de exemplares');

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

    console.log(relatorio4);

    // 5. Autores sem obras usando LEFT JOIN e IS NULL.
    console.log('\n5. Autores sem obras - LEFT JOIN e IS NULL');

    const inicioLeftJoin = Date.now();

    const relatorio5 = await autores
      .createQueryBuilder('autor')
      .leftJoin('autor.obras', 'obra')
      .where('obra.id IS NULL')
      .getMany();

    const tempoLeftJoin = Date.now() - inicioLeftJoin;

    console.log('Autores encontrados:', relatorio5);
    console.log(`Quantidade: ${relatorio5.length}`);
    console.log(`Tempo LEFT JOIN: ${tempoLeftJoin} ms`);

    // 6. Autores sem obras usando NOT IN.
    console.log('\n6. Autores sem obras - NOT IN');

    const inicioNotIn = Date.now();

    const relatorio6 = await autores
      .createQueryBuilder('autor')
      .where(
        'autor.id NOT IN ' +
          '(SELECT obra.autor_id FROM obras obra)',
      )
      .getMany();

    const tempoNotIn = Date.now() - inicioNotIn;

    console.log('Autores encontrados:', relatorio6);
    console.log(`Quantidade: ${relatorio6.length}`);
    console.log(`Tempo NOT IN: ${tempoNotIn} ms`);

    // Comparação das duas estratégias.
    console.log('\n========== COMPARAÇÃO DE DESEMPENHO ==========');

    console.log(
      `LEFT JOIN + IS NULL: ${relatorio5.length} autores | ${tempoLeftJoin} ms`,
    );

    console.log(
      `NOT IN: ${relatorio6.length} autores | ${tempoNotIn} ms`,
    );

    console.log(
      '\nAs duas consultas devem retornar os mesmos autores.',
    );

    console.log(
      'A quantidade de SQL e os comandos executados podem ser conferidos nos logs do TypeORM.',
    );
  } catch (erro) {
    console.error('Erro ao executar relatórios:', erro);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

executarRelatorios();
