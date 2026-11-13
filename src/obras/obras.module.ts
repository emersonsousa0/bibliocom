
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Autor } from '../autores/entities/autor.entity.js';
import { Obra } from './entities/obra.entity.js';

import { ObrasController } from './obras.controller.js';
import { ObrasService } from './obras.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Obra, Autor])],
  controllers: [ObrasController],
  providers: [ObrasService],
  exports: [ObrasService],
})
export class ObrasModule {}
