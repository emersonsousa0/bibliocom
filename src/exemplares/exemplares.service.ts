
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exemplar } from './entities/exemplar.entity.js';
import { Obra } from '../obras/entities/obra.entity.js';
import { CriarExemplarDto } from './dto/criar-exemplar.dto.js';
import { AtualizarExemplarDto } from './dto/atualizar-exemplar.dto.js';
import { ExemplarResposta } from './dto/exemplar-resposta.dto.js';
import { PaginacaoQueryDto } from '../common/dto/paginacao-query.dto.js';
import { RespostaPaginada } from '../common/dto/resposta-paginada.dto.js';

@Injectable()
export class ExemplaresService {
  constructor(
    @InjectRepository(Exemplar)
    private readonly exemplaresRepository: Repository<Exemplar>,

    @InjectRepository(Obra)
    private readonly obrasRepository: Repository<Obra>,
  ) {}

  private converterParaResposta(exemplar: Exemplar): ExemplarResposta {
    return {
      id: exemplar.id,
      tombo: exemplar.tombo,
      estado: exemplar.estado,
      dataAquisicao: exemplar.dataAquisicao,
      obraTitulo: exemplar.obra.titulo,
    };
  }

  private tratarErroBanco(erro: any): never {
    if (erro?.driverError?.code === '23505') {
      throw new ConflictException('Já existe um exemplar com esse tombo.');
    }

    throw erro;
  }

  async criar(dto: CriarExemplarDto): Promise<ExemplarResposta> {
    const obra = await this.obrasRepository.findOne({
      where: { id: dto.obraId },
    });

    if (!obra) {
      throw new NotFoundException('Obra não encontrada.');
    }

    const exemplar = this.exemplaresRepository.create({
      tombo: dto.tombo,
      estado: dto.estado,
      dataAquisicao: dto.dataAquisicao,
      obra,
    });

    try {
      const salvo = await this.exemplaresRepository.save(exemplar);

      return this.converterParaResposta(salvo);
    } catch (erro) {
      return this.tratarErroBanco(erro);
    }
  }

  async listar(
    paginacao: PaginacaoQueryDto,
  ): Promise<RespostaPaginada<ExemplarResposta>> {
    const pagina = paginacao.pagina || 1;
    const tamanho = paginacao.tamanho || 10;

    const [exemplares, total] =
      await this.exemplaresRepository.findAndCount({
        relations: { obra: true },
        skip: (pagina - 1) * tamanho,
        take: tamanho,
        order: { id: 'ASC' },
      });

    return {
      dados: exemplares.map((exemplar) =>
        this.converterParaResposta(exemplar),
      ),
      total,
      pagina,
      tamanho,
      totalPaginas: Math.ceil(total / tamanho),
    };
  }

  async buscarPorId(id: number): Promise<ExemplarResposta> {
    const exemplar = await this.exemplaresRepository.findOne({
      where: { id },
      relations: { obra: true },
    });

    if (!exemplar) {
      throw new NotFoundException('Exemplar não encontrado.');
    }

    return this.converterParaResposta(exemplar);
  }

  async atualizar(
    id: number,
    dto: AtualizarExemplarDto,
  ): Promise<ExemplarResposta> {
    const exemplar = await this.exemplaresRepository.findOne({
      where: { id },
      relations: { obra: true },
    });

    if (!exemplar) {
      throw new NotFoundException('Exemplar não encontrado.');
    }

    if (dto.obraId !== undefined) {
      const obra = await this.obrasRepository.findOne({
        where: { id: dto.obraId },
      });

      if (!obra) {
        throw new NotFoundException('Obra não encontrada.');
      }

      exemplar.obra = obra;
    }

    if (dto.tombo !== undefined) exemplar.tombo = dto.tombo;
    if (dto.estado !== undefined) exemplar.estado = dto.estado;

    if (dto.dataAquisicao !== undefined) {
      exemplar.dataAquisicao = dto.dataAquisicao;
    }

    try {
      const atualizado = await this.exemplaresRepository.save(exemplar);

      return this.converterParaResposta(atualizado);
    } catch (erro) {
      return this.tratarErroBanco(erro);
    }
  }

  async excluir(id: number): Promise<void> {
    const exemplar = await this.exemplaresRepository.findOne({
      where: { id },
    });

    if (!exemplar) {
      throw new NotFoundException('Exemplar não encontrado.');
    }

    await this.exemplaresRepository.remove(exemplar);
  }
}
