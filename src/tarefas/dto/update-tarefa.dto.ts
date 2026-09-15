import { PartialType } from '@nestjs/mapped-types';
import { CreateTarefaDto } from './create-tarefa.dto.js';

export class UpdateTarefaDto extends PartialType(CreateTarefaDto) {}
