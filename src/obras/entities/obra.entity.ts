import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Autor } from '../../autores/entities/autor.entity.js';
import { Exemplar } from '../../exemplares/entities/exemplar.entity.js';

@Entity('obras')
export class Obra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  isbn: string | null;

  @Column({ name: 'ano_publicacao', type: 'int' })
  anoPublicacao: number;

  @ManyToOne(() => Autor, (autor) => autor.obras, { nullable: false })
  @JoinColumn({ name: 'autor_id' })
  autor: Autor;

  @OneToMany(() => Exemplar, (exemplar) => exemplar.obra)
  exemplares: Exemplar[];
}
