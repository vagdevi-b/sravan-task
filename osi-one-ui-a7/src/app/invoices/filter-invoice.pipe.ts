import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterInvoice'
})
export class FilterInvoicePipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;

searchText = searchText.toLowerCase();
return items.filter( it => {
      return it.invoiceLayoutName.toLowerCase().includes(searchText);
    });
   }
}