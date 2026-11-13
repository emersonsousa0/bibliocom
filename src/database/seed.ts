
import 'reflect-metadata';
import 'dotenv/config';

import { AppDataSource } from './data-source.js';
import { Autor } from '../autores/entities/autor.entity.js';
import { Obra } from '../obras/entities/obra.entity.js';
import { Exemplar } from '../exemplares/entities/exemplar.entity.js';
import { EstadoExemplar } from '../exemplares/entities/estado-exemplar.enum.js';

async function executarSeed() {
  try {
    await AppDataSource.initialize();

    const autorRepository = AppDataSource.getRepository(Autor);
    const obraRepository = AppDataSource.getRepository(Obra);
    const exemplarRepository = AppDataSource.getRepository(Exemplar);

    console.log('Inserindo dados de demonstração...');

    const dadosAutores = [
      'Machado de Assis',
      'Graciliano Ramos',
      'Jorge Amado',
      'Rachel de Queiroz',
      'José de Alencar',
      'Clarice Lispector',
      'Euclides da Cunha',
      'Ariano Suassuna',
    ];

    const autoresSalvos: Autor[] = [];

    for (const nome of dadosAutores) {
      let autor = await autorRepository.findOneBy({ nome });

      if (!autor) {
        autor = await autorRepository.save(
          autorRepository.create({ nome }),
        );
      }

      autoresSalvos.push(autor);
    }

    const dadosObras = [
      {
        titulo: 'Dom Casmurro',
        isbn: '9788535910663',
        anoPublicacao: 1899,
        autor: autoresSalvos[0],
      },
      {
        titulo: 'Memórias Póstumas de Brás Cubas',
        isbn: '9788535910670',
        anoPublicacao: 1881,
        autor: autoresSalvos[0],
      },
      {
        titulo: 'Vidas Secas',
        isbn: '9788501910384',
        anoPublicacao: 1938,
        autor: autoresSalvos[1],
      },
      {
        titulo: 'São Bernardo',
        isbn: '9788501019484',
        anoPublicacao: 1934,
        autor: autoresSalvos[1],
      },
      {
        titulo: 'Capitães da Areia',
        isbn: '9788535911691',
        anoPublicacao: 1937,
        autor: autoresSalvos[2],
      },
      {
        titulo: 'O Quinze',
        isbn: '9788503010008',
        anoPublicacao: 1930,
        autor: autoresSalvos[3],
      },
      {
        titulo: 'O Sertanejo',
        isbn: null,
        anoPublicacao: 1875,
        autor: autoresSalvos[4],
      },
      {
        titulo: 'A Hora da Estrela',
        isbn: '9788520925688',
        anoPublicacao: 1977,
        autor: autoresSalvos[5],
      },
      {
        titulo: 'Os Sertões',
        isbn: null,
        anoPublicacao: 1902,
        autor: autoresSalvos[6],
      },
      {
        titulo: 'Auto da Compadecida',
        isbn: '9788520938474',
        anoPublicacao: 1955,
        autor: autoresSalvos[7],
      },
    ];

    const obrasSalvas: Obra[] = [];

    for (const dados of dadosObras) {
      let obra = await obraRepository.findOne({
        where: {
          titulo: dados.titulo,
          autor: { id: dados.autor.id },
        },
        relations: {
          autor: true,
        },
      });

      if (!obra) {
        obra = await obraRepository.save(
          obraRepository.create(dados),
        );
      }

      obrasSalvas.push(obra);
    }

    const dadosExemplares = [
      {
        tombo: 'BIB-0001',
        estado: EstadoExemplar.DISPONIVEL,
        dataAquisicao: '2024-01-10',
        obra: obrasSalvas[0],
      },
      {
        tombo: 'BIB-0002',
        estado: EstadoExemplar.EMPRESTADO,
        dataAquisicao: '2024-02-15',
        obra: obrasSalvas[0],
      },
      {
        tombo: 'BIB-0003',
        estado: EstadoExemplar.DESGASTADO,
        dataAquisicao: '2023-05-20',
        obra: obrasSalvas[1],
      },
      {
        tombo: 'BIB-0004',
        estado: EstadoExemplar.DESCARTADO,
        dataAquisicao: '2022-03-12',
        obra: obrasSalvas[2],
      },
      {
        tombo: 'BIB-0005',
        estado: EstadoExemplar.DISPONIVEL,
        dataAquisicao: '2024-06-18',
        obra: obrasSalvas[2],
      },
      {
        tombo: 'BIB-0006',
        estado: EstadoExemplar.EMPRESTADO,
        dataAquisicao: '2023-08-09',
        obra: obrasSalvas[3],
      },
      {
        tombo: 'BIB-0007',
        estado: EstadoExemplar.DESGASTADO,
        dataAquisicao: '2024-04-22',
        obra: obrasSalvas[4],
      },
      {
        tombo: 'BIB-0008',
        estado: EstadoExemplar.DISPONIVEL,
        dataAquisicao: '2025-01-05',
        obra: obrasSalvas[5],
      },
      {
        tombo: 'BIB-0009',
        estado: EstadoExemplar.DISPONIVEL,
        dataAquisicao: '2023-11-11',
        obra: obrasSalvas[7],
      },
      {
        tombo: 'BIB-0010',
        estado: EstadoExemplar.DESCARTADO,
        dataAquisicao: '2022-09-30',
        obra: obrasSalvas[9],
      },
    ];

    let quantidadeExemplares = 0;

    for (const dados of dadosExemplares) {
      const existente = await exemplarRepository.findOneBy({
        tombo: dados.tombo,
      });

      if (!existente) {
        await exemplarRepository.save(
          exemplarRepository.create(dados),
        );

        quantidadeExemplares++;
      }
    }

    console.log('Seed concluído com sucesso!');
    console.log(`Autores verificados: ${autoresSalvos.length}`);
    console.log(`Obras verificadas: ${obrasSalvas.length}`);
    console.log(`Exemplares novos inseridos: ${quantidadeExemplares}`);
  } catch (erro) {
    console.error('Erro ao executar o seed:', erro);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

executarSeed();
