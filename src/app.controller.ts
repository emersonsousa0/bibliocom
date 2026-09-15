import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller('alunos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
getAlunos(): string[]{
  return this.appService.listAlunos();
}

}
