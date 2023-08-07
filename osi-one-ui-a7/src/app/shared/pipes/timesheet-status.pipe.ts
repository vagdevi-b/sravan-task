import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timesheetStatus'
})
export class TimesheetStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let x = value;
      if (x == 'S')
        return 'Submitted';
      else if (x == 'O')
        return 'Approved';
      else if (x == 'R')
        return 'Rejected';
      else if (x == 'N')
        return 'Saved';
      else if (x == 'V')
        return 'Over Due';
      else if (x == 'U')
        return 'Adjusted';
      else if (x == 'I')
        return 'Invoiced';
      else if (x == 'G')
        return 'Charged';
      else if (x == 'F')
        return 'FIXED';

      /*	As per disucussion everything else showing as approved
        else if(x == 'I')
          return 'Invoiced';
        else if(x == 'G')
          return 'Charged';  */
  }

}
