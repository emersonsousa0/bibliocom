import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Obra } from '../../obras/entities/obra.entity.js';
import { EstadoExemplar } from './estado-exemplar.enum.js';

@Entity('exemplares')
export class Exemplar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  tombo: string;

  @Column({
    type: 'enum',
    enum: EstadoExemplar,
    default: EstadoExemplar.DISPONIVEL,
  })
  estado: EstadoExemplar;

  @Column({ name: 'data_aquisicao', type: 'date' })
  dataAquisicao: string;

  @ManyToOne(() => Obra, (obra) => obra.exemplares, { nullable: false })
  @JoinColumn({ name: 'obra_id' })
  obra: Obra;

  @RelationId((exemplar: Exemplar) => exemplar.obra)
  obraId: number;
}
