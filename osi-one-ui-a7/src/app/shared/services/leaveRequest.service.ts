import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
//import { CONFIGURATION } from '../app.config';
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { HttpUtilities } from "../utilities";
import { AppConstants } from "../app-constants";

@Injectable()
export class LeaveRequestService {
  private appData = AppConstants;
  private leaveRequestServiceCtx: string = "leave/";

  // these regexes are for performing case insensitive matching
  public readonly PTO_LEAVE_TYPE_REGEX = /PAID TIME OFF \(PTO\)/i;
  public readonly LOP_LEAVE_TYPE_REGEX = /LOSS OF PAY \(LOP\)/i;

  constructor(private httpUtilities: HttpUtilities) {}

  getLeaveTypes(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl + this.leaveRequestServiceCtx + "getLeavesType")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getEmployeeLeavesDetails(): Observable<any> {
    return this.httpUtilities
    .get(this.appData.appUrl +"genericLeave/getEmployeeLeavesDetails")
    .map((response: any) => response)
    .catch(this.handleError);

  }
  
  getHoursByLeaveId(leaveId): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.appUrl +
          "leave/getLeaveDaysByLeaveType?leaveTypeId=" +
          leaveId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getLeavesApplyingHours(fromDate, toDate, leaveId): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.appUrl +
          "leave/getLeavesApplyingHours?fromDate=" +
          fromDate +
          "&toDate=" +
          toDate +
          "&leaveId=" +
          (leaveId || '')
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  saveLeaveRequest(user): Observable<any> {
    return this.httpUtilities
      .post(this.appData.appUrl + "leave/saveLeave", user)
      .map((response: any) => {
        return response;
      })
      .catch(this.handleError);
  }

  getMailSuggestion(mail): Observable<any> {
    return this.httpUtilities
      .post(this.appData.appUrl + "assignments/searchEmployeeByEmpName/" + mail)
      .map((response: any) => {
        return response;
      });
  }
  getAssignedUsers(id): Observable<any> {
    return (
      this.httpUtilities
        // .get(this.appData.appUrl + 'pmAcivitygetAssignedUsers/'+id)
        .get(
          this.appData.appUrl + "pmAcivity/getAssignedUsers/" + id
         // this.appData.appUrl +"pmAcivity/getAssignedUsers/" + id
        )
        .map((response: any) => response)
        .catch(this.handleError)
    );
  }

  submitLeaveRequest(user): Observable<any> {
    return this.httpUtilities
      .post(this.appData.appUrl + "leave/createLeave", user)
      .map((response: any) => {
        return response;
      })
      .catch(this.handleError);
  }

  editLeaveRequest(user): Observable<any> {
    return this.httpUtilities
      .put(this.appData.appUrl + "leave/updateLeave", user)
      .map((response: any) => {
        return response;
      })
      .catch(this.handleError);
  }

  cancelstatus(fromDate, toDate): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.appUrl +
          "leave/cancelStatus?fromDate=" +
          fromDate +
          "&toDate=" +
          toDate
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  cancelLeaveRequest(leaveId: string): Observable<any> {
    return this.httpUtilities
      .delete(this.appData.appUrl + "leave/cancelLeaveByEmp?leaveId=" + leaveId)
      .map((response: any) => {
        return response;
      });
  }

  searchLeaveHistory(fname, lname, empNumber): Observable<any[]> {
    return this.httpUtilities
      .get(
        this.appData.appUrl +
          "leave/getEmpLeaveHoursDetails?fname=" +
          fname +
          "&lname=" +
          lname +
          "&empNumber=" +
          empNumber
      )
      .map((response: any) => response);
  }

  leaveBalanceHistory(empId): Observable<any[]> {
    return this.httpUtilities
      .get(
        this.appData.appUrl +
          "leaveAccurual/getEmployeeLeaveAccuralStatusDetails/" +
          empId
      )
      .map((response: any) => response);
  }

  adjustEmpLeaveHoursDetails(updateData): Observable<any[]> {
    return this.httpUtilities
      .post(
        this.appData.appUrl + "leave/adjustEmpLeaveHoursDetails",
        updateData
      )
      .map((response: any) => {
        return response;
      });
  }

  cancelApprovedLeaveRequest(user): Observable<any> {
    return this.httpUtilities
      .post(this.appData.appUrl + "leave/cancelApprovedLeaveByEmp", user)
      .map((response: any) => {
        return response;
      });
  }

  downloadFile(duplicateFileName: string, leaveId: string): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.appUrl +
          "leave/downloadfile/" +
          duplicateFileName +
          "/" +
          leaveId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  /* returns true if text matches either PTO_LEAVE_TYPE_REGEX or LOP_LEAVE_TYPE_REGEX
   * else returns false */
  isPTOOrLOP(text: string): boolean {

      return this.PTO_LEAVE_TYPE_REGEX.test(text)
        || this.LOP_LEAVE_TYPE_REGEX.test(text);
  }

  /* Returns true if logged in employee's org code allows employee
   * to apply for PTO leave even when available leave balance is insufficient
   * */
  isInsufficientPTOHoursAllowed(): boolean {
    return this.appData.INSUFFICIENT_PTO_ALLOWED_ORG_CODES
      .includes(localStorage.getItem('orgCode'));
  }

  /**
   * Removes PTO option from list of leave types if LOP item
   * exists and PTO item exists and leave balance is <= 0 */
  removePTOIfNoLeaveBalance(leaveTypesArray: any[], leaveBalance: number) {

    const lopIndex: number = leaveTypesArray.findIndex(
      each => this.LOP_LEAVE_TYPE_REGEX.test(each.leaveTypeName)
    );

    if (lopIndex !== -1) {

      const ptoIndex: number = leaveTypesArray.findIndex(
        each => this.PTO_LEAVE_TYPE_REGEX.test(each.leaveTypeName)
      );

      if (ptoIndex !== -1 && leaveBalance <= 0) {
        leaveTypesArray.splice(ptoIndex, 1);
      }
    }
  }

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error("error========" + error);
    return Observable.throw(
      error.json().error ||
        error.json().errorMessage ||
        "Failed in web api(Server error) "
    );
  }
}
