import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortnumber',
    pure: true
})
export class ShortNumberhPipe implements PipeTransform {

    transform(input: any, args?: any): any {
        var exp, rounded,
            suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];
        if (Number.isNaN(input)) {
            return null;
        }
        if (input < 1000) {
            return input.toFixed(args);
        }
        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
    }

}