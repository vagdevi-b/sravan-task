import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AppConstants } from '../../shared/app-constants';
import { HttpUtilities } from '../../shared/utilities/';

@Injectable()
export class MissingExchangeRatesService {

  private appData = AppConstants;
  private serviceCtx: string = "scheduleexchangerates/";

  constructor(private httpUtilities: HttpUtilities) { }

  getMissingExchangeRates(): Observable<any> {
    return this.httpUtilities.get(this.appData.appUrl + this.serviceCtx + 'getMissingExchangeRates')
        .map((response: any) => response)
        .catch(this.handleError);
  }

  runMissingExchangeRates(exchangeRates): Observable<any> {
    return this.httpUtilities.post(this.appData.appUrl + this.serviceCtx + 'runMissingExchangeRates', exchangeRates)
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
