
import 'reflect-metadata';
import 'dotenv/config';

import { In } from 'typeorm';
import { AppDataSource } from './data-source.js';
import { Autor } from '../autores/entities/autor.entity.js';
import { Obra } from '../obras/entities/obra.entity.js';

async function executarSeedVolume() {
  try {
    await AppDataSource.initialize();

    const autorRepository = AppDataSource.getRepository(Autor);
    const obraRepository = AppDataSource.getRepository(Obra);

    const nomesAutores = Array.from(
      { length: 100 },
      (_, i) => `Autor Demonstracao N1 ${String(i + 1).padStart(3, '0')}`,
    );

    const autoresExistentes = await autorRepository.find({
      where: { nome: In(nomesAutores) },
    });

    const nomesExistentes = new Set(
      autoresExistentes.map((autor) => autor.nome),
    );

    const novosAutores = nomesAutores
      .filter((nome) => !nomesExistentes.has(nome))
      .map((nome) => autorRepository.create({ nome }));

    if (novosAutores.length > 0) {
      await autorRepository.save(novosAutores);
    }

    const autores = await autorRepository.find({
      where: { nome: In(nomesAutores) },
    });

    const obrasExistentes = await obraRepository
      .createQueryBuilder('obra')
      .leftJoinAndSelect('obra.autor', 'autor')
      .where('obra.titulo LIKE :prefixo', {
        prefixo: 'Demonstracao N1 - Obra %',
      })
      .getMany();

    const chavesExistentes = new Set(
      obrasExistentes.map(
        (obra) => `${obra.autor.id}|${obra.titulo}`,
      ),
    );

    const novasObras: Obra[] = [];

    for (let i = 0; i < 500; i++) {
      const titulo = `Demonstracao N1 - Obra ${String(i + 1).padStart(3, '0')}`;
      const autor = autores[Math.floor(i / 5)];

      if (!chavesExistentes.has(`${autor.id}|${titulo}`)) {
        novasObras.push(
          obraRepository.create({
            titulo,
            isbn: null,
            anoPublicacao: 1900 + (i % 126),
            autor,
          }),
        );
      }
    }

    if (novasObras.length > 0) {
      await obraRepository.save(novasObras);
    }

    console.log('Carga de demonstracao concluida!');
    console.log(`Autores de demonstracao: ${autores.length}`);
    console.log(`Obras existentes: ${obrasExistentes.length}`);
    console.log(`Novas obras inseridas: ${novasObras.length}`);
    console.log(
      `Total de obras de demonstracao: ${obrasExistentes.length + novasObras.length}`,
    );
  } catch (erro) {
    console.error('Erro na carga de demonstracao:', erro);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

executarSeedVolume();
