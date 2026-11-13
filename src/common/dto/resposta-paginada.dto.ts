
import { ApiProperty } from '@nestjs/swagger';

export class RespostaPaginada<T> {
  @ApiProperty({
    description: 'Registros retornados na página atual.',
    isArray: true,
  })
  dados!: T[];

  @ApiProperty({
    description: 'Quantidade total de registros encontrados.',
    example: 50,
  })
  total!: number;

  @ApiProperty({
    description: 'Número da página atual.',
    example: 1,
  })
  pagina!: number;

  @ApiProperty({
    description: 'Quantidade de registros por página.',
    example: 10,
  })
  tamanho!: number;

  @ApiProperty({
    description: 'Quantidade total de páginas.',
    example: 5,
  })
  totalPaginas!: number;
}
