import { Injectable } from '@angular/core';
import { AnimationStyleMetadata} from '@angular/animations';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IManagerDashboardServiceDetail } from '../utilities/managerDashboardServiceDetail';
import { IExpenseDetails } from '../utilities/expenseDetails';
import { AppConstants } from '../app-constants';
import { HttpUtilities } from '../utilities';

@Injectable()
export class ManagerExpenseService {
  private appData = AppConstants;
  private managerViewServiceCtx: string = "managerexpenses/";
  data;
  constructor(private httpUtilities: HttpUtilities) { }

  getAllExpensesByWeek(): Observable<AnimationStyleMetadata[]> {
        return this.httpUtilities.get(this.appData.appUrl + this.managerViewServiceCtx + 'getAllExpenses')
        .map((response: any) => response)
        .catch(this.handleError);
}

getAllExpensesForSelectedRange(daterange: string): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.managerViewServiceCtx + 'getExpensesForSelectedRange?selectedDateRange=' + daterange)
        .map((response: any) => response)
        .catch(this.handleError);
}

getExpensesInDateRange(startDate: string, enddate: string): Observable<any> {
  return this.httpUtilities.get(this.appData.appUrl + this.managerViewServiceCtx + 'getExpensesInDateRange?startDate=' + startDate+'&endDate='+enddate)
        .map((response: any) => response)
        .catch(this.handleError);
}

getExpensesByDateAndStatus(urlData:string):Observable<any>{
  return this.httpUtilities.get(this.appData.appUrl + this.managerViewServiceCtx + 'getExpensesBasedOnFilters?' + urlData)
          .map((response: Response) => response)
          .catch(this.handleError);
}

getExpenseLineItemsForExcel(expenseIdList):Observable<any>{
  return this.httpUtilities.post(this.appData.appUrl + 'managerapproveexpenses/getExpenseBasedOnIdList',expenseIdList)
          .map((response: Response) => response)
          .catch(this.handleError);
}

approveExpensesFromReportPage(expenseIdList):Observable<any>{
  return this.httpUtilities.post(this.appData.appUrl + 'managerapproveexpenses/approveFromReportPage',expenseIdList)
          .map((response: Response) => response)
          .catch(this.handleError);
}

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Failed in web api(Server error) ');
  }
}
