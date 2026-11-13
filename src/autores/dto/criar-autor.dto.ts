
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CriarAutorDto {
  @ApiProperty({
    description: 'Nome completo do autor.',
    example: 'Machado de Assis',
    minLength: 2,
    maxLength: 150,
  })
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do autor é obrigatório.' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
  @MaxLength(150, { message: 'O nome deve ter no máximo 150 caracteres.' })
  nome: string;
}
