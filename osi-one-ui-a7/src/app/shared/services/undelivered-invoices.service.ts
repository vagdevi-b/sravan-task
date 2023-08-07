import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AppConstants } from '../../shared/app-constants';
import { HttpUtilities } from '../../shared/utilities/';

@Injectable()
export class UndeliveredInvoicesService {

  private appData = AppConstants;
  private serviceCtx: string = "invoice/";
  private timesheetServiceCtx: string = "timeSheets/";
  

  constructor(private httpUtilities: HttpUtilities) { }

  getUndeliveredInvoices(): Observable<any> {
    return this.httpUtilities.get(this.appData.invoiceUrl + this.serviceCtx + 'getAllUndeliveredInvoices')
        .map((response: any) => response)
        .catch(this.handleError);
  }

  getMissingTimeSheets(): Observable<any> {
    return this.httpUtilities.get(this.appData.invoiceUrl + 'api/' + this.timesheetServiceCtx + 'getMissingTimeSheets')
        .map((response: any) => response)
        .catch(this.handleError);
  }


  addMissingTSToApprovers(employeeId, calendarId): Observable<any> {
    return this.httpUtilities.post(this.appData.invoiceUrl + 'api/'+ this.timesheetServiceCtx + 'addMissingTSToApprovers?employeeId='+employeeId+'&calendarId='+calendarId)
        .map((response: any) => response)
        .catch(this.handleError);
  }

  updateUndeliveredInvoices(undeliveredInvoices): Observable<any> {
    return this.httpUtilities.post(this.appData.invoiceUrl + this.serviceCtx + 'updateUndeliveredInvoicesStatus', undeliveredInvoices)
        .map((response: any) => response)
        .catch(this.handleError);
  }

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error("error========"+error);
    return Observable.throw(error.json().error || 'Failed in web api(Server error) ');
  }

}
