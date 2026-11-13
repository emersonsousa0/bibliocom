import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from 'typeorm';

import { Autor } from '../autores/entities/autor.entity.js';
import { Obra } from '../obras/entities/obra.entity.js';
import { Exemplar } from '../exemplares/entities/exemplar.entity.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('A variável DATABASE_URL não foi definida no arquivo .env');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [Autor, Obra, Exemplar],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
