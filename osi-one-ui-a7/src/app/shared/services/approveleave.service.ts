
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
export class ApproveLeaveService{
  
  
    private appData = AppConstants;
    private leaveServiceCtx = "leave/";

    constructor(private httpUtilities: HttpUtilities) { }

    getAppliedLeaves(): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.leaveServiceCtx + 'getAllEmployeeLeave')
        .map((response: any) => response)
        .catch(this.handleError);
    }

    getEmployeeLeaveByLeaveId(leaveId): Observable<any> {
      return this.httpUtilities.get(this.appData.appUrl + "leave/" + 'getEmployeeLeave?leaveId=' + leaveId)
               .map((response: any) => response)
               .do(data => console.log(" Leave Edit Data ======== : "+JSON.stringify(data)))
               .catch(this.handleError);
  }

 getLeavesApplyingHours(fromDate,toDate, leaveId):Observable<any>{
  return this.httpUtilities.get(
    this.appData.appUrl + 'leave/getLeavesApplyingHours?fromDate=' + fromDate + '&toDate=' + toDate + '&leaveId=' + leaveId
  )
  .map((response: any) => response)
  .catch(this.handleError);
}

    approvedLeaves(approvedLeave: any): any {
        console.log("arg0 : "+JSON.stringify(approvedLeave));
        return this.httpUtilities.post(this.appData.appUrl + this.leaveServiceCtx + "approveLeave",approvedLeave)
        .map((response: any) => response)
        .catch(this.handleError);
        // /throw new Error("Method not implemented.");
      }

      rejectedLeaves(approvedLeave: any): any {
        console.log("Rejected leave info : "+JSON.stringify(approvedLeave));
        return this.httpUtilities.post(this.appData.appUrl + this.leaveServiceCtx + "rejectLeave",approvedLeave)
        .map((response: any) => response)
        .catch(this.handleError);
        // /throw new Error("Method not implemented.");
      }

      getEmployeeLeaveDetailsAtApprovalTime(leaveId): any {
        return this.httpUtilities.get(this.appData.appUrl + this.leaveServiceCtx + 'getEmployeeLeaveDetailsAtApprovalTime?leaveId='+leaveId)
        .map((response: any) => response)
        .catch(this.handleError);
      }

      

      getEmployeeLastAppliedLeave(leaveId): any {
        console.log("getEmployeeLastAppliedLeave : Service ....."+leaveId);
        return this.httpUtilities.get(this.appData.appUrl + this.leaveServiceCtx + 'getEmployeeLastAppliedLeave?leaveId='+leaveId)
        .map((response: any) => response)
        .catch(this.handleError);
      }

      getHolidaysAtRMApproval(leaveId): any {
        console.log("getEmployeeLastAppliedLeave : Service ....."+leaveId);
        return this.httpUtilities.get(this.appData.appUrl + 'holiday/' + 'getHolidaysAtRMApproval?leaveId='+leaveId)
        .map((response: any) => response)
        .catch(this.handleError);
      }
	  
	  cancelApprovedLeave(approvedLeave: any): any {
        console.log("arg0 : "+JSON.stringify(approvedLeave));
        return this.httpUtilities.post(this.appData.appUrl + this.leaveServiceCtx + "cancelLeaveByRM",approvedLeave)
        .map((response: any) => response)
        .catch(this.handleError);
        // /throw new Error("Method not implemented.");
      }

      dayByDayLeavesDetails(leaveId){
        return this.httpUtilities.get(this.appData.appUrl + this.leaveServiceCtx +'getEmployeeLeave?leaveId='+leaveId)
        .map((response: any) => response)
        .catch(this.handleError);
      }
	  
	  downloadFile(duplicateFileName: string, leaveId: string): Observable<any> {

		return this.httpUtilities.get(this.appData.appUrl + "leave/downloadfile/" + duplicateFileName + "/" + leaveId)
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