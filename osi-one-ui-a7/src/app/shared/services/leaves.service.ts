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
export class LeavesService {
private appData = AppConstants;
private leaveRequestServiceCtx: string = "leave/";
constructor(private httpUtilities: HttpUtilities) { }
 
getEmployeeType(): Observable<any> {
return this.httpUtilities.get(this.appData.appUrl + this.leaveRequestServiceCtx + 'getReportingEmployeeDetail')
.map((response: any) => response)
.catch(this.handleError);
}

getEmployeeLeavesById(empId): Observable<any> {
    return this.httpUtilities.get(this.appData.appUrl + this.leaveRequestServiceCtx + 'getReportingEmployeeLeaveDetails?empId='+empId)
    .map((response: any) => response)
    .catch(this.handleError);
    }
 
private handleError(error: Response) {
// in a real world app, we may send the server to some remote logging infrastructure
// instead of just logging it to the console
console.error("error========"+error);
return Observable.throw(error.json().error || 'Failed in web api(Server error) ');
}
 getLeaveBalance(){
     return this.httpUtilities.get(this.appData.appUrl+'leaveAccurual/getEmployeeLeaveAccuralDetails ')
     .map((response: any) => response)
 }

}