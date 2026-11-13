
import { ApiProperty } from '@nestjs/swagger';

export class AutorResposta {
  @ApiProperty({
    description: 'Identificador do autor.',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Nome completo do autor.',
    example: 'Machado de Assis',
  })
  nome!: string;
}
