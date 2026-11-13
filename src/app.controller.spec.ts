import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { vi } from 'vitest';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getAlunos', () => {
    it('deve retornar a lista de alunos', () => {
      const alunos = ['Ana', 'João'];

      vi.spyOn(appService, 'listAlunos').mockReturnValue(alunos);
      expect(appController.getAlunos()).toEqual(alunos);
    });
  });
});
