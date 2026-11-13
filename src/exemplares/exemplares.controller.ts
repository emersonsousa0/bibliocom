
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';

import { ExemplaresService } from './exemplares.service.js';
import { CriarExemplarDto } from './dto/criar-exemplar.dto.js';
import { AtualizarExemplarDto } from './dto/atualizar-exemplar.dto.js';
import { ExemplarResposta } from './dto/exemplar-resposta.dto.js';
import { PaginacaoQueryDto } from '../common/dto/paginacao-query.dto.js';
import { RespostaPaginada } from '../common/dto/resposta-paginada.dto.js';

@ApiTags('Exemplares')
@ApiExtraModels(RespostaPaginada, ExemplarResposta)
@Controller('exemplares')
export class ExemplaresController {
  constructor(private readonly exemplaresService: ExemplaresService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo exemplar' })
  @ApiResponse({
    status: 201,
    description: 'Exemplar cadastrado com sucesso.',
    type: ExemplarResposta,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Obra informada não encontrada.' })
  @ApiResponse({ status: 409, description: 'O tombo informado já está cadastrado.' })
  criar(@Body() dto: CriarExemplarDto): Promise<ExemplarResposta> {
    return this.exemplaresService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar exemplares com paginação' })
  @ApiQuery({ name: 'pagina', required: false, example: 1 })
  @ApiQuery({ name: 'tamanho', required: false, example: 10, maximum: 100 })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de exemplares.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(RespostaPaginada) },
        {
          properties: {
            dados: {
              type: 'array',
              items: { $ref: getSchemaPath(ExemplarResposta) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Parâmetros de paginação inválidos.' })
  listar(
    @Query() paginacao: PaginacaoQueryDto,
  ): Promise<RespostaPaginada<ExemplarResposta>> {
    return this.exemplaresService.listar(paginacao);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar exemplar pelo ID' })
  @ApiParam({ name: 'id', description: 'Identificador do exemplar', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Exemplar encontrado.',
    type: ExemplarResposta,
  })
  @ApiResponse({ status: 404, description: 'Exemplar não encontrado.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExemplarResposta> {
    return this.exemplaresService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um exemplar' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Exemplar atualizado.',
    type: ExemplarResposta,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Exemplar ou obra não encontrado.' })
  @ApiResponse({ status: 409, description: 'O tombo informado já está cadastrado.' })
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarExemplarDto,
  ): Promise<ExemplarResposta> {
    return this.exemplaresService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um exemplar' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Exemplar excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Exemplar não encontrado.' })
  excluir(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.exemplaresService.excluir(id);
  }
}
