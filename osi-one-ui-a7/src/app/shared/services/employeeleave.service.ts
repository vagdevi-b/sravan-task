
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
//import { CONFIGURATION } from '../app.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpUtilities } from '../utilities';
import { AppConstants } from '../app-constants';
 
@Injectable()
export class EmployeeLeaveService{
    private appData = AppConstants;
    private leaveServiceCtx = "leave/";

    constructor(private httpUtilities: HttpUtilities) { }

    getEmployeeLeaveById(leaveId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.leaveServiceCtx + 'getEmployeeLeave?leaveId='+leaveId)
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