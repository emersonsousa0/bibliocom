import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { ProdutosModule } from './produtos/produtos.module.js';
import { TarefasModule } from './tarefas/tarefas.module.js';
import { CategoriasModule } from './categorias/categorias.module.js';

import { AlunosController } from './alunos/alunos.controller.js';
import { AlunosService } from './alunos/alunos.service.js';

import { AutoresModule } from './autores/autores.module.js';
import { ObrasModule } from './obras/obras.module.js';
import { ExemplaresModule } from './exemplares/exemplares.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
      }),
    }),
    ProdutosModule,
    TarefasModule,
    CategoriasModule,
    AutoresModule,
    ObrasModule,
    ExemplaresModule,
  ],
  controllers: [AppController, AlunosController],
  providers: [AppService, AlunosService],
})
export class AppModule {}
