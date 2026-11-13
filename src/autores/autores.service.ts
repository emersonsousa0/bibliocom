
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Autor } from './entities/autor.entity.js';
import { CriarAutorDto } from './dto/criar-autor.dto.js';
import { AtualizarAutorDto } from './dto/atualizar-autor.dto.js';
import { AutorResposta } from './dto/autor-resposta.dto.js';
import { PaginacaoQueryDto } from '../common/dto/paginacao-query.dto.js';
import { RespostaPaginada } from '../common/dto/resposta-paginada.dto.js';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor)
    private readonly autoresRepository: Repository<Autor>,
  ) {}

  private converterParaResposta(autor: Autor): AutorResposta {
    return {
      id: autor.id,
      nome: autor.nome,
    };
  }

  async criar(dto: CriarAutorDto): Promise<AutorResposta> {
    const autor = this.autoresRepository.create(dto);
    const autorSalvo = await this.autoresRepository.save(autor);

    return this.converterParaResposta(autorSalvo);
  }

  async listar(
    paginacao: PaginacaoQueryDto,
  ): Promise<RespostaPaginada<AutorResposta>> {
    const pagina = paginacao.pagina || 1;
    const tamanho = paginacao.tamanho || 10;

    const [autores, total] = await this.autoresRepository.findAndCount({
      skip: (pagina - 1) * tamanho,
      take: tamanho,
      order: { id: 'ASC' },
    });

    return {
      dados: autores.map((autor) => this.converterParaResposta(autor)),
      total,
      pagina,
      tamanho,
      totalPaginas: Math.ceil(total / tamanho),
    };
  }

  async buscarPorId(id: number): Promise<AutorResposta> {
    const autor = await this.autoresRepository.findOne({
      where: { id },
    });

    if (!autor) {
      throw new NotFoundException('Autor não encontrado.');
    }

    return this.converterParaResposta(autor);
  }

  async atualizar(
    id: number,
    dto: AtualizarAutorDto,
  ): Promise<AutorResposta> {
    const autor = await this.autoresRepository.findOne({
      where: { id },
    });

    if (!autor) {
      throw new NotFoundException('Autor não encontrado.');
    }

    Object.assign(autor, dto);

    const autorAtualizado = await this.autoresRepository.save(autor);

    return this.converterParaResposta(autorAtualizado);
  }

  async excluir(id: number): Promise<void> {
    const autor = await this.autoresRepository.findOne({
      where: { id },
    });

    if (!autor) {
      throw new NotFoundException('Autor não encontrado.');
    }

    await this.autoresRepository.remove(autor);
  }
}
