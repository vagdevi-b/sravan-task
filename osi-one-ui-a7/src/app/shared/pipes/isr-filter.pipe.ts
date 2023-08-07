import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customerIsrFilter'
})
export class IsrFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value; 
    }
    return value.filter((val) => {
      let rVal = (val.customer.toLocaleLowerCase().includes(args)) || (val.contactFirst.toLocaleLowerCase().includes(args)) || 
				 (val.contactLast.toLocaleLowerCase().includes(args)) || (val.contactEmail.toLocaleLowerCase().includes(args)) ||
				 (val.cityCode.toLocaleLowerCase().includes(args)) || (val.isrNumber!=undefined && val.isrNumber.toLocaleLowerCase().includes(args)) ||
				 (val.countryCode.toLocaleLowerCase().includes(args)) || (val.stateCode.toLocaleLowerCase().includes(args)) ||
				 (val.designation.toLocaleLowerCase().includes(args)) || (val.designation.toLocaleLowerCase().includes(args));
      return rVal;
    })

  }

}