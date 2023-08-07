import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IExpenseDetails } from '../utilities/expenseDetails';
import { AppConstants } from '../app-constants';
import { HttpUtilities } from '../utilities';

@Injectable()
export class ManagerApproveExpenseService {

    private appData = AppConstants;
    private managerApproveViewServiceCtx: string = "managerapproveexpenses/";
    data;

    constructor(private httpUtilities: HttpUtilities) { }

    getExpenseBasedOnId(trackingid: string): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.managerApproveViewServiceCtx + 'getExpenseBasedOnId?trackingid=' + trackingid)
        .map((response: any) => response)
        .catch(this.handleError);

    }

    rejectExpense(requestData: any): any {
        return this.httpUtilities.put(this.appData.appUrl + this.managerApproveViewServiceCtx + "rejectExpenses", requestData)
            .map((response: Response) => {
                return response;
            });
    }

    approveExpense(requestData: any): any {
        return this.httpUtilities.put(this.appData.appUrl + this.managerApproveViewServiceCtx + "approveExpenses", requestData)
            .map((response: Response) => {
                return response;
            });
    }

    getExpenseListToApprove(): any {
        return this.httpUtilities.get(this.appData.appUrl + "managerexpenses/getAllExpensesByProject")
        .map((response: Response) => {
            return response;
        });
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error("error========" + error);
        return Observable.throw(error.json().error || 'Failed in web api(Server error) ');
    }
}

