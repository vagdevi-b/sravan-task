import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';

import { IExpenseDetails } from '../utilities/expenseDetails';
import { AppConstants } from '../../shared/app-constants';
import { HttpUtilities } from '../../shared/utilities/';

@Injectable()
export class ViewExpensesService {

    private appData = AppConstants;
    private viewServiceCtx: string = "viewexpenses/";
    private auditLogsCtx: string = "auditLogs/";
    data;

    constructor(private httpUtilities: HttpUtilities) { }

    getAllExpensesByWeek(): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.viewServiceCtx + 'getAllExpenses')
            .map((response: any) => response)
            .catch(this.handleError);
    }

    getAllExpensesForSelectedRange(daterange: string): Observable<any> {
       return this.httpUtilities.get(this.appData.appUrl + this.viewServiceCtx + 'getExpensesForSelectedRange?selectedDateRange=' + daterange)
                .map((response: Response) => response)
                .catch(this.handleError);
    }

    getExpensesInDateRange(startDate: string, enddate: string): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.viewServiceCtx + 'getExpensesInDateRange?startDate=' + startDate+'&endDate='+enddate)
                .map((response: Response) => response)
                .catch(this.handleError);
    }
    
    statusBasedExpenses(status: string): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.viewServiceCtx + 'getExpenseBasedOnStatus?status=' + status)
                .map((response: Response) => response)
                .catch(this.handleError);
    }

    expensesForReimbursed(status: string): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.viewServiceCtx + 'getExpenseBasedOnStatus?status=' + status)
                .map((response: Response) => response)
                .catch(this.handleError);
    }

    getExpensesByDateAndStatus(urlData:string):Observable<any>{
        return this.httpUtilities.get(this.appData.appUrl + this.viewServiceCtx + 'getExpensesBasedOnFilters?' + urlData)
                .map((response: Response) => response)
                .catch(this.handleError);
    }

    getReimbursedExpenses(urlData:string):Observable<any>{
        return this.httpUtilities.get(this.appData.appUrl + this.viewServiceCtx + 'getReimbursedExpenses?' + urlData)
                .map((response: Response) => response)
                .catch(this.handleError);
    }

   /* getSubmittedStatusExpenses(status: string): Observable<IExpenseDetails[]> {
        return this._http.get(this.serviceUrl + 'getExpenseBasedOnStatus?status=' + status)
                .map((response: Response) => <IExpenseDetails[]>response.json())
                .do(data => JSON.stringify(data))
                .catch(this.handleError);
    }

    getRejectedStatusExpenses(status: string): Observable<IExpenseDetails[]> {
        return this._http.get(this.serviceUrl + 'getExpenseBasedOnStatus?status=' + status)
                .map((response: Response) => <IExpenseDetails[]>response.json())
                .do(data => JSON.stringify(data))
                .catch(this.handleError);
    }

    getAllStatusExpenses(status: string): Observable<IExpenseDetails[]> {
        return this._http.get(this.serviceUrl + 'getExpenseBasedOnStatus?status=' + status)
                .map((response: Response) => <IExpenseDetails[]>response.json())
                .do(data => JSON.stringify(data))
                .catch(this.handleError);
    }*/

    getExpenseAuditData(expenseid: string): Observable<any> {
        return this.httpUtilities.get(this.appData.invoiceUrl + this.auditLogsCtx + 'getExpenseAuditLogs?expenseId=' + expenseid)
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