import { IsEmail, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateAlunoDto {
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsDateString()
  dataNascimento?: string;
}
