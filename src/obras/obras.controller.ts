
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

import { ObrasService } from './obras.service.js';
import { CriarObraDto } from './dto/criar-obra.dto.js';
import { AtualizarObraDto } from './dto/atualizar-obra.dto.js';
import { ObraResposta } from './dto/obra-resposta.dto.js';
import { PaginacaoQueryDto } from '../common/dto/paginacao-query.dto.js';
import { RespostaPaginada } from '../common/dto/resposta-paginada.dto.js';

@ApiTags('Obras')
@ApiExtraModels(RespostaPaginada, ObraResposta)
@Controller('obras')
export class ObrasController {
  constructor(private readonly obrasService: ObrasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova obra' })
  @ApiResponse({
    status: 201,
    description: 'Obra cadastrada com sucesso.',
    type: ObraResposta,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Autor informado não encontrado.' })
  criar(@Body() dto: CriarObraDto): Promise<ObraResposta> {
    return this.obrasService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar obras com paginação' })
  @ApiQuery({ name: 'pagina', required: false, example: 1 })
  @ApiQuery({ name: 'tamanho', required: false, example: 10, maximum: 100 })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de obras.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(RespostaPaginada) },
        {
          properties: {
            dados: {
              type: 'array',
              items: { $ref: getSchemaPath(ObraResposta) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Parâmetros de paginação inválidos.' })
  listar(
    @Query() paginacao: PaginacaoQueryDto,
  ): Promise<RespostaPaginada<ObraResposta>> {
    return this.obrasService.listar(paginacao);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar obra pelo ID' })
  @ApiParam({ name: 'id', description: 'Identificador da obra', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Obra encontrada.',
    type: ObraResposta,
  })
  @ApiResponse({ status: 404, description: 'Obra não encontrada.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<ObraResposta> {
    return this.obrasService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma obra' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Obra atualizada.',
    type: ObraResposta,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Obra ou autor não encontrado.' })
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarObraDto,
  ): Promise<ObraResposta> {
    return this.obrasService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma obra' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Obra excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Obra não encontrada.' })
  excluir(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.obrasService.excluir(id);
  }
}
