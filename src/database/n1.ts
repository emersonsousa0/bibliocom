
import 'reflect-metadata';
import 'dotenv/config';

import { DataSource, Logger } from 'typeorm';
import { AppDataSource } from './data-source.js';
import { Obra } from '../obras/entities/obra.entity.js';
import { Autor } from '../autores/entities/autor.entity.js';

async function demonstrarN1() {
  let quantidadeConsultas = 0;

  const contador: Logger = {
    logQuery() {
      quantidadeConsultas++;
    },
    logQueryError() {},
    logQuerySlow() {},
    logSchemaBuild() {},
    logMigration() {},
    log() {},
  };

  const dataSource = new DataSource({
    ...AppDataSource.options,
    logger: contador,
    logging: ['query'],
  });

  try {
    await dataSource.initialize();

    const obrasRepository = dataSource.getRepository(Obra);
    const autoresRepository = dataSource.getRepository(Autor);

    console.log('\n========== E06.2 - PROBLEMA N+1 ==========\n');

    console.log('1. Implementação com problema N+1');

    quantidadeConsultas = 0;
    const inicioRuim = Date.now();

    const obrasRuins = await obrasRepository
      .createQueryBuilder('obra')
      .select([
        'obra.id AS id',
        'obra.titulo AS titulo',
        'obra.autor_id AS "autorId"',
      ])
      .orderBy('obra.id', 'ASC')
      .take(50)
      .getRawMany<{
        id: number;
        titulo: string;
        autorId: number;
      }>();

    for (const obra of obrasRuins) {
      const autor = await autoresRepository.findOneBy({
        id: obra.autorId,
      });

      console.log(
        `Obra: ${obra.titulo} | Autor: ${autor?.nome ?? 'Não encontrado'}`,
      );
    }

    const tempoRuim = Date.now() - inicioRuim;
    const consultasRuins = quantidadeConsultas;

    console.log(`Obras encontradas: ${obrasRuins.length}`);
    console.log(`Consultas SQL medidas: ${consultasRuins}`);
    console.log(`Tempo da implementação N+1: ${tempoRuim} ms`);

    console.log('\n2. Implementação otimizada');

    quantidadeConsultas = 0;
    const inicioBom = Date.now();

    const obrasBoas = await obrasRepository.find({
      take: 50,
      order: { id: 'ASC' },
      relations: { autor: true },
    });

    for (const obra of obrasBoas) {
      console.log(
        `Obra: ${obra.titulo} | Autor: ${obra.autor.nome}`,
      );
    }

    const tempoBom = Date.now() - inicioBom;
    const consultasBoas = quantidadeConsultas;

    console.log(`Obras encontradas: ${obrasBoas.length}`);
    console.log(`Consultas SQL medidas: ${consultasBoas}`);
    console.log(`Tempo da implementação otimizada: ${tempoBom} ms`);

    console.log('\n========== COMPARAÇÃO ==========');
    console.log(`N+1: ${consultasRuins} consultas | ${tempoRuim} ms`);
    console.log(`Otimizada: ${consultasBoas} consultas | ${tempoBom} ms`);

    console.log(
      '\nA contagem considera as consultas SQL registradas pelo TypeORM.',
    );
  } catch (erro) {
    console.error('Erro na demonstração N+1:', erro);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

demonstrarN1();
