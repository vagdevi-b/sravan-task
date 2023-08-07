import { Injectable } from '@angular/core';
import { HttpUtilities } from '../utilities';
import { Observable } from 'rxjs';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root'
})
export class PaymentSummaryService {
    private appData = AppConstants;
    requistionData:any;
    profileData:any;
    constructor(private httpUtilities: HttpUtilities) { }
    PaymentSummary(body):Observable<any>{
        let url = `${this.appData.invoiceUrl}dashboard/reports/project/getInvoicedVsPayments`;
        return this.httpUtilities.post(url, body)
        .map((response: any) => {
          return response;
        })
      }

}
