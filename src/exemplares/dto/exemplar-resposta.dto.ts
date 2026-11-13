
import { ApiProperty } from '@nestjs/swagger';
import { EstadoExemplar } from '../entities/estado-exemplar.enum.js';

export class ExemplarResposta {
  @ApiProperty({
    description: 'Identificador do exemplar.',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Código de tombamento do exemplar.',
    example: 'EX-001',
  })
  tombo!: string;

  @ApiProperty({
    description: 'Estado atual do exemplar.',
    enum: EstadoExemplar,
    example: EstadoExemplar.DISPONIVEL,
  })
  estado!: EstadoExemplar;

  @ApiProperty({
    description: 'Data de aquisição do exemplar.',
    example: '2025-03-15',
    format: 'date',
  })
  dataAquisicao!: string;

  @ApiProperty({
    description: 'Título da obra à qual o exemplar pertence.',
    example: 'Dom Casmurro',
  })
  obraTitulo!: string;
}
