
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

import { AutoresService } from './autores.service.js';
import { CriarAutorDto } from './dto/criar-autor.dto.js';
import { AtualizarAutorDto } from './dto/atualizar-autor.dto.js';
import { AutorResposta } from './dto/autor-resposta.dto.js';
import { PaginacaoQueryDto } from '../common/dto/paginacao-query.dto.js';
import { RespostaPaginada } from '../common/dto/resposta-paginada.dto.js';

@ApiTags('Autores')
@ApiExtraModels(RespostaPaginada, AutorResposta)
@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo autor' })
  @ApiResponse({
    status: 201,
    description: 'Autor cadastrado com sucesso.',
    type: AutorResposta,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  criar(@Body() dto: CriarAutorDto): Promise<AutorResposta> {
    return this.autoresService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar autores com paginação' })
  @ApiQuery({ name: 'pagina', required: false, example: 1 })
  @ApiQuery({ name: 'tamanho', required: false, example: 10, maximum: 100 })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de autores.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(RespostaPaginada) },
        {
          properties: {
            dados: {
              type: 'array',
              items: { $ref: getSchemaPath(AutorResposta) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de paginação inválidos.',
  })
  listar(
    @Query() paginacao: PaginacaoQueryDto,
  ): Promise<RespostaPaginada<AutorResposta>> {
    return this.autoresService.listar(paginacao);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar autor pelo ID' })
  @ApiParam({ name: 'id', description: 'Identificador do autor', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Autor encontrado.',
    type: AutorResposta,
  })
  @ApiResponse({ status: 404, description: 'Autor não encontrado.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<AutorResposta> {
    return this.autoresService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um autor' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Autor atualizado.',
    type: AutorResposta,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Autor não encontrado.' })
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarAutorDto,
  ): Promise<AutorResposta> {
    return this.autoresService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um autor' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Autor excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Autor não encontrado.' })
  excluir(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.autoresService.excluir(id);
  }
}
