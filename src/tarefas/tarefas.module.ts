import { Module } from '@nestjs/common';
import { TarefasService } from './tarefas.service.js';
import { TarefasController } from './tarefas.controller.js';

@Module({
  controllers: [TarefasController],
  providers: [TarefasService],
})
export class TarefasModule {}
