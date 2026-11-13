
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarObraDto {
  @ApiProperty({
    description: 'Título da obra.',
    example: 'Dom Casmurro',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @ApiPropertyOptional({
    description: 'ISBN da obra. Pode ser nulo ou não informado.',
    example: '9788535910663',
    maxLength: 20,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  isbn?: string | null;

  @ApiProperty({
    description: 'Ano de publicação da obra.',
    example: 1899,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  anoPublicacao: number;

  @ApiProperty({
    description: 'ID do autor relacionado à obra.',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  autorId: number;
}
