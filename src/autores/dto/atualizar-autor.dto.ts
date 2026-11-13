
import { PartialType } from '@nestjs/swagger';
import { CriarAutorDto } from './criar-autor.dto.js';

export class AtualizarAutorDto extends PartialType(CriarAutorDto) {}
