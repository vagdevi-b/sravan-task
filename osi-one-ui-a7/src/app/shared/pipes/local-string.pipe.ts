import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'localstring',
    pure: true
})
export class LocalStringPipe implements PipeTransform {

    transform(input: any, args: any = 0): any {
        if (typeof input !== 'number') {
            return input;
        }
        return this.roundTo(input, args).toLocaleString();
    }

    roundTo(num: number, places: number) {
        let factor = 10 ** places;
        return Math.round(num * factor) / factor;
    }

}