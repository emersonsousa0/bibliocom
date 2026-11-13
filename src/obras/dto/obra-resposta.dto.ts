
import { ApiProperty } from '@nestjs/swagger';

export class ObraResposta {
  @ApiProperty({
    description: 'Identificador da obra.',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Título da obra.',
    example: 'Dom Casmurro',
  })
  titulo!: string;

  @ApiProperty({
    description: 'ISBN da obra, quando disponível.',
    example: '9788535910663',
    nullable: true,
  })
  isbn!: string | null;

  @ApiProperty({
    description: 'Ano de publicação.',
    example: 1899,
  })
  anoPublicacao!: number;

  @ApiProperty({
    description: 'Nome do autor relacionado à obra.',
    example: 'Machado de Assis',
  })
  autorNome!: string;
}
