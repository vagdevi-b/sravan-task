import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceStatus'
})
export class InvoiceStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == 'S')
      return 'Submitted';
    else if (value == 'O')
      return 'Approved';
    else if (value == 'R')
      return 'Rejected';
    else if (value == 'D')
      return 'Accepted';
    else if (value == 'P')
      return 'Amount Paid';
    else if (value == 'T')
      return 'Sent';
    else if (value == 'U')
      return 'Reversed';
    else if (value == 'V')
      return 'Cancelled';
    else if (value == 'W')
      return 'Write-Off';
    else if (value == 'X')
      return 'Suspend';
    else if (value == 'Y')
      return 'Partial Amount';
    else if (value == 'Z')
      return 'Viewed';
  }

}
