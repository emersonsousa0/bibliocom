import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

private alunos: string[] = ['Emerson','Marjory','Eduardo']

listAlunos(): string[] {
  return this.alunos;
}

}

