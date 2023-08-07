import { Pipe, PipeTransform } from '@angular/core';

@Pipe({

    name: 'EmployeeNameFilter'

})

export class SearchPipe implements PipeTransform {



    transform(value: any, args?: any): any {

        if (!args) {

            return value;

        }

        return value.filter((val) => {

            let rVal = (val.status.toLowerCase().includes(args) || (val.employeeName.toLowerCase().includes(args)) || (val.employeeNumber.toLowerCase().includes(args)));

            return rVal;

        })



    }



}