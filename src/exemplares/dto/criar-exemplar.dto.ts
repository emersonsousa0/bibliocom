
import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Min,
  Validate,
} from 'class-validator';

import { Type } from 'class-transformer';
import { EstadoExemplar } from '../entities/estado-exemplar.enum.js';
import { DataNaoFuturaValidator } from './data-nao-futura.validator.js';

export class CriarExemplarDto {
  @ApiProperty({
    description: 'Código de tombamento do exemplar. Aceita letras maiúsculas, números e hífen.',
    example: 'EX-001',
    minLength: 3,
    maxLength: 20,
    pattern: '^[A-Z0-9-]+$',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'O tombo deve conter apenas letras maiúsculas, números e hífen.',
  })
  tombo: string;

  @ApiProperty({
    description: 'Estado atual de conservação ou disponibilidade do exemplar.',
    enum: EstadoExemplar,
    example: EstadoExemplar.DISPONIVEL,
  })
  @IsEnum(EstadoExemplar)
  estado: EstadoExemplar;

  @ApiProperty({
    description: 'Data de aquisição do exemplar. Não pode ser uma data futura.',
    example: '2025-03-15',
    format: 'date',
  })
  @IsDateString()
  @Validate(DataNaoFuturaValidator)
  dataAquisicao: string;

  @ApiProperty({
    description: 'ID da obra à qual o exemplar pertence.',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  obraId: number;
}
