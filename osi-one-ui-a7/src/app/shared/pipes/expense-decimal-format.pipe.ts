import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'expenseDecimalFormat' })
export class ExpenseDecimalFormatPipe implements PipeTransform {
  transform(valueToFormat:Number) {
    return Number(valueToFormat).toFixed(Math.max(((Number(valueToFormat)+'').split(".")[1]||"").length, 2));
  }
}