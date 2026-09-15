import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProdutosModule } from './produtos/produtos.module.js';
import { TarefasModule } from './tarefas/tarefas.module.js';
import { CategoriasModule } from './categorias/categorias.module.js';
import { AlunosController } from './alunos/alunos.controller.js';
import { AlunosService } from './alunos/alunos.service.js';


@Module({
  imports: [
  
  ProdutosModule,
  
  TarefasModule,
  
  CategoriasModule],
  controllers: [AppController, AlunosController],
  providers: [AppService, AlunosService],
})
export class AppModule {}
