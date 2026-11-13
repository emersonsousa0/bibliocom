
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configuracaoSwagger = new DocumentBuilder()
    .setTitle('BiblioCom API')
    .setDescription(
      'API para gerenciamento de autores, obras e exemplares de uma biblioteca.',
    )
    .setVersion('1.0')
    .addTag('Autores', 'Gerenciamento de autores')
    .addTag('Obras', 'Gerenciamento de obras')
    .addTag('Exemplares', 'Gerenciamento de exemplares')
    .build();

  const documento = SwaggerModule.createDocument(
    app,
    configuracaoSwagger,
  );

  SwaggerModule.setup('api/docs', app, documento);

  writeFileSync(
    resolve(process.cwd(), 'openapi.json'),
    JSON.stringify(documento, null, 2),
    'utf-8',
  );

  await app.listen(process.env.PORT ?? 3000);

  console.log('Documentação Swagger: http://localhost:3000/api/docs');
  console.log('Arquivo OpenAPI gerado: openapi.json');
}

await bootstrap();
