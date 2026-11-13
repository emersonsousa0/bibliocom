
import 'reflect-metadata';
import 'dotenv/config';

import { AppDataSource } from './data-source.js';
import { Autor } from '../autores/entities/autor.entity.js';
import { Obra } from '../obras/entities/obra.entity.js';
import { Exemplar } from '../exemplares/entities/exemplar.entity.js';
import { EstadoExemplar } from '../exemplares/entities/estado-exemplar.enum.js';
import { In, IsNull, ILike, LessThan } from 'typeorm';

async function executarConsultas() {
  try {
    await AppDataSource.initialize();

    const autores = AppDataSource.getRepository(Autor);
    const obras = AppDataSource.getRepository(Obra);
    const exemplares = AppDataSource.getRepository(Exemplar);

    console.log('\n========== E06.1 - CONSULTAS COM REPOSITÓRIOS ==========\n');

    // 1. Obras publicadas antes de 1900
    console.log('\n1. Obras publicadas antes de 1900');
    const consulta1 = await obras.find({
      where: { anoPublicacao: LessThan(1900) },
      relations: { autor: true },
    });
    console.log(consulta1);

    // 2. Obras com "sertão" no título
    console.log('\n2. Obras com "sertão" no título');
    const consulta2 = await obras.find({
      where: { titulo: ILike('%sertão%') },
      relations: { autor: true },
    });
    console.log(consulta2);

    // 3. Obras de Machado de Assis
    console.log('\n3. Obras de Machado de Assis');
    const consulta3 = await obras.find({
      where: { autor: { nome: 'Machado de Assis' } },
      relations: { autor: true },
    });
    console.log(consulta3);

    // 4. Exemplares desgastados ou descartados
    console.log('\n4. Exemplares desgastados ou descartados');
    const consulta4 = await exemplares.find({
      where: {
        estado: In([
          EstadoExemplar.DESGASTADO,
          EstadoExemplar.DESCARTADO,
        ]),
      },
      relations: { obra: true },
    });
    console.log(consulta4);

    // 5. Obras sem ISBN
    console.log('\n5. Obras sem ISBN');
    const consulta5 = await obras.find({
      where: { isbn: IsNull() },
      relations: { autor: true },
    });
    console.log(consulta5);

    // 6. Dez obras mais recentes
    console.log('\n6. Dez obras mais recentes');
    const consulta6 = await obras.find({
      relations: { autor: true },
      order: { anoPublicacao: 'DESC' },
      take: 10,
    });
    console.log(consulta6);

    // 7. Autores cujo nome começa com Machado
    console.log('\n7. Autores que começam com Machado');
    const consulta7 = await autores.find({
      where: { nome: ILike('Machado%') },
    });
    console.log(consulta7);

    // 8. Quantidade total de obras
    console.log('\n8. Quantidade total de obras');
    const consulta8 = await obras.count();
    console.log('Total de obras:', consulta8);

    console.log('\n========== CONSULTAS CONCLUÍDAS ==========');
  } catch (erro) {
    console.error('Erro ao executar as consultas:', erro);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

executarConsultas();
