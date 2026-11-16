
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('BiblioCom (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /autores deve retornar uma lista paginada', () => {
    return request(app.getHttpServer())
      .get('/autores')
      .expect(200)
      .expect((response) => {
        if (
          !response.body ||
          !Array.isArray(response.body.dados) ||
          typeof response.body.total !== 'number' ||
          typeof response.body.pagina !== 'number' ||
          typeof response.body.tamanho !== 'number' ||
          typeof response.body.totalPaginas !== 'number'
        ) {
          throw new Error('Formato de resposta paginada inválido.');
        }
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
