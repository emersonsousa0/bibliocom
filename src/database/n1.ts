
import 'reflect-metadata';
import 'dotenv/config';

import { AppDataSource } from './data-source.js';
import { Obra } from '../obras/entities/obra.entity.js';
import { Autor } from '../autores/entities/autor.entity.js';

async function demonstrarN1() {
  try {
    await AppDataSource.initialize();

    const obrasRepository = AppDataSource.getRepository(Obra);
    const autoresRepository = AppDataSource.getRepository(Autor);

    console.log('\n========== E06.2 - PROBLEMA N+1 ==========\n');

    // CENÁRIO 1: uma consulta para as obras e uma para cada autor.
    console.log('1. Implementação com problema N+1');

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
    const consultasRuins = 1 + obrasRuins.length;

    console.log(`Obras encontradas: ${obrasRuins.length}`);
    console.log(`Consultas SQL esperadas: ${consultasRuins}`);
    console.log(`Tempo da implementação N+1: ${tempoRuim} ms`);

    // CENÁRIO 2: obras e autores carregados em uma consulta.
    console.log('\n2. Implementação otimizada');

    const inicioBom = Date.now();

    const obrasBoas = await obrasRepository.find({
      take: 50,
      order: { id: 'ASC' },
      relations: {
        autor: true,
      },
    });

    for (const obra of obrasBoas) {
      console.log(
        `Obra: ${obra.titulo} | Autor: ${obra.autor.nome}`,
      );
    }

    const tempoBom = Date.now() - inicioBom;

    console.log(`Obras encontradas: ${obrasBoas.length}`);
    console.log('Consultas SQL esperadas: 1');
    console.log(`Tempo da implementação otimizada: ${tempoBom} ms`);

    // COMPARAÇÃO
    console.log('\n========== COMPARAÇÃO ==========');
    console.log(`N+1: ${consultasRuins} consultas | ${tempoRuim} ms`);
    console.log(`Otimizada: 1 consulta | ${tempoBom} ms`);

    console.log(
      '\nConfira também os comandos SQL registrados no terminal.',
    );
  } catch (erro) {
    console.error('Erro na demonstração N+1:', erro);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

demonstrarN1();
