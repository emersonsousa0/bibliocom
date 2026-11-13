
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Exemplar } from './entities/exemplar.entity.js';
import { Obra } from '../obras/entities/obra.entity.js';

import { ExemplaresController } from './exemplares.controller.js';
import { ExemplaresService } from './exemplares.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Exemplar, Obra])],
  controllers: [ExemplaresController],
  providers: [ExemplaresService],
  exports: [ExemplaresService],
})
export class ExemplaresModule {}

