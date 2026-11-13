import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'dataNaoFutura', async: false })
export class DataNaoFuturaValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (typeof value !== 'string') return false;

    const data = new Date(`${value}T00:00:00`);
    if (Number.isNaN(data.getTime())) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return data <= hoje;
  }

  defaultMessage(): string {
    return 'A data de aquisição não pode ser futura.';
  }
}
