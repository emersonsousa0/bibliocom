
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Obra } from './entities/obra.entity.js';
import { Autor } from '../autores/entities/autor.entity.js';
import { CriarObraDto } from './dto/criar-obra.dto.js';
import { AtualizarObraDto } from './dto/atualizar-obra.dto.js';
import { ObraResposta } from './dto/obra-resposta.dto.js';
import { PaginacaoQueryDto } from '../common/dto/paginacao-query.dto.js';
import { RespostaPaginada } from '../common/dto/resposta-paginada.dto.js';

@Injectable()
export class ObrasService {
  constructor(
    @InjectRepository(Obra)
    private readonly obrasRepository: Repository<Obra>,

    @InjectRepository(Autor)
    private readonly autoresRepository: Repository<Autor>,
  ) {}

  private converterParaResposta(obra: Obra): ObraResposta {
    return {
      id: obra.id,
      titulo: obra.titulo,
      isbn: obra.isbn,
      anoPublicacao: obra.anoPublicacao,
      autorNome: obra.autor.nome,
    };
  }

  async criar(dto: CriarObraDto): Promise<ObraResposta> {
    const autor = await this.autoresRepository.findOne({
      where: { id: dto.autorId },
    });

    if (!autor) {
      throw new NotFoundException('Autor não encontrado.');
    }

    const obra = this.obrasRepository.create({
      titulo: dto.titulo,
      isbn: dto.isbn ?? null,
      anoPublicacao: dto.anoPublicacao,
      autor,
    });

    const salva = await this.obrasRepository.save(obra);

    return this.converterParaResposta(salva);
  }

  async listar(
    paginacao: PaginacaoQueryDto,
  ): Promise<RespostaPaginada<ObraResposta>> {
    const pagina = paginacao.pagina || 1;
    const tamanho = paginacao.tamanho || 10;

    const [obras, total] = await this.obrasRepository.findAndCount({
      relations: { autor: true },
      skip: (pagina - 1) * tamanho,
      take: tamanho,
      order: { id: 'ASC' },
    });

    return {
      dados: obras.map((obra) => this.converterParaResposta(obra)),
      total,
      pagina,
      tamanho,
      totalPaginas: Math.ceil(total / tamanho),
    };
  }

  async buscarPorId(id: number): Promise<ObraResposta> {
    const obra = await this.obrasRepository.findOne({
      where: { id },
      relations: { autor: true },
    });

    if (!obra) {
      throw new NotFoundException('Obra não encontrada.');
    }

    return this.converterParaResposta(obra);
  }

  async atualizar(
    id: number,
    dto: AtualizarObraDto,
  ): Promise<ObraResposta> {
    const obra = await this.obrasRepository.findOne({
      where: { id },
      relations: { autor: true },
    });

    if (!obra) {
      throw new NotFoundException('Obra não encontrada.');
    }

    if (dto.autorId !== undefined) {
      const autor = await this.autoresRepository.findOne({
        where: { id: dto.autorId },
      });

      if (!autor) {
        throw new NotFoundException('Autor não encontrado.');
      }

      obra.autor = autor;
    }

    if (dto.titulo !== undefined) {
      obra.titulo = dto.titulo;
    }

    if (dto.isbn !== undefined) {
      obra.isbn = dto.isbn;
    }

    if (dto.anoPublicacao !== undefined) {
      obra.anoPublicacao = dto.anoPublicacao;
    }

    const atualizada = await this.obrasRepository.save(obra);

    return this.converterParaResposta(atualizada);
  }

  async excluir(id: number): Promise<void> {
    const obra = await this.obrasRepository.findOne({
      where: { id },
    });

    if (!obra) {
      throw new NotFoundException('Obra não encontrada.');
    }

    await this.obrasRepository.remove(obra);
  }
}
