import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bookfilter',
    pure: false
})
export class BookFilterPipe implements PipeTransform {
  transform(items: any[], filter: any[]): any[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item) => item.status.toLowerCase().search(filter) !== -1 );
    /*return items.filter((item: any) => this.applyFilter(item, filter));*/
  }
  
 /**
   * Perform the filtering.
   * 
   * @param {Book} book The book to compare to the filter.
   * @param {Book} filter The filter to apply.
   * @return {boolean} True if book satisfies filters, false if not.
   */
  applyFilter(item: any, filter: any): boolean {
     return filter ? item.filter(item => item.staus.indexOf(filter) !== -1)
     : item;

    /*for (let field.status in filter) {
        console.log(JSON.stringify(book) +"27 : "+field);
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (book[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (book[field] !== filter[field]) {
            return false;
          }
        }
      }
    }*/
    
  }

}