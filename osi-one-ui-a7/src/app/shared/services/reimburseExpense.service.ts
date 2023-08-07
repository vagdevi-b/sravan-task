import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import { CONFIGURATION } from '../app.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IExpenseTypes } from '../utilities/expenseTypes.model';
import { IProjects } from '../utilities/projectsData.model';
import { ITasks } from '../utilities/tasksData.model';
import { ICurrencies } from '../utilities/curenciesData.model';
import { ICurrencyExchangeDetails } from '../utilities/currencyExchangeDetails.model';
import { AppConstants } from '../../shared/app-constants';
import { HttpUtilities } from '../../shared/utilities/';
import { servicesVersion } from 'typescript';

@Injectable()
export class ReimburseExpenseService {

    private appData = AppConstants;
    private createServiceCtx: string = "expense/";
    data;

    constructor(private httpUtilities: HttpUtilities, private http: HttpClient) { }

    getExpensesTypes(projectId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'savereimbursement?projectId=' + projectId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    reimburseExpense(expense): Observable<any> {
        return this.httpUtilities.post(this.appData.appUrl + this.createServiceCtx + "savereimbursement", expense)
            .map((response: any) => {
                return response;
            });
    }

    reimburseExpenseReportPage(expense): Observable<any> {
        return this.httpUtilities.post(this.appData.appUrl + this.createServiceCtx + "saveReimbursementReportPage", expense)
            .map((response: any) => {
                return response;
            });
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        /// console.error("error========",error);
        return Observable.throw(error || 'Failed in web api(Server error) ');
    }

}