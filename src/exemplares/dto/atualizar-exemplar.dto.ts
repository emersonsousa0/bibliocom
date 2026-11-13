
import { PartialType } from '@nestjs/swagger';
import { CriarExemplarDto } from './criar-exemplar.dto.js';

export class AtualizarExemplarDto extends PartialType(CriarExemplarDto) {}
