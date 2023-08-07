import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngbDateFormat'
})
export class NgbDateFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value && value['day'] && value['month']){
      const day=value['day'] < 10 ? '0'+value['day'] : value['day'];
      const month=value['month'] < 10 ? '0'+value['month'] : value['month'];
      return `${day}-${month}-${value['year']}`;
    }
    return '';
  }

}
