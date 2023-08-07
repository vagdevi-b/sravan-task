import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../app-constants';
import { Observable } from 'rxjs/Observable';
import { HttpUtilities } from '../utilities/http-utilities';
import * as moment from 'moment';

@Injectable()
export class PmoAdminService {
  timesheetDetails: any;
  filterParams: any;

  constructor(
    private http: HttpClient,
    private httpUtilities: HttpUtilities
  ) { }

  getSelectedTimesheetDetails(): any {
    return this.timesheetDetails;
  }

  setSelectedTimesheetDetails(tsDetails: any): any {
    this.timesheetDetails = tsDetails;
  }

  getFilterParamDetails(): any {
    return this.filterParams;
  }

  setFilterParamDetails(filterParam: any): any {
    this.filterParams = filterParam;
  }

  // getEmployees(): Observable<any> {
  //   const authUrl = `${AppConstants.appUrl}weekly_tsm/searchEmployees`;
  //   return this.http.get(authUrl);
  // }


  getEmployees(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + 'weekly_tsm/searchEmployees')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjects(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + 'weekly_tsm/getAllProjectList')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectBySuggestion(body): Observable<any> {
    return this.httpUtilities.post(AppConstants.appUrl + 'project/projectByFilters', body)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getEmployeeTimesheetDetails(userId, orgId, noOfWeeks, projectId): Observable<any> {
    var sysDate = moment(new Date()).format('YYYY-MM-DD');
    var noOfRows = 0;
    var curDate = new Date();
    if (noOfWeeks == 0) {
      noOfWeeks = Math.floor(curDate.getDate() / 7);
      curDate.setDate(curDate.getDate() - curDate.getDate());
      sysDate = moment(curDate).format('YYYY-MM-DD');
    } else {
      curDate.setDate(curDate.getDate() - curDate.getDate());
      sysDate = moment(curDate).format('YYYY-MM-DD');
    }
    var url = 'weekly_tsm/searchEmployeesTimeSheetSummary?userId=' + userId + '&orgId=' + orgId + '&sysDate=' + sysDate + '&noOfWeeks=' + noOfWeeks + '&projectId=' + projectId + '&noOfRows=' + noOfRows;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getLookupValue(lookupValue: any, lookupType: any): Observable<any> {
    let url = 'timeSheets/getLookupValueIdByValue?lookupValue=' + lookupValue + '&lookupType=' + lookupType;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getCalender(timesheetDate: any, orgId: any): Observable<any> {
    let url = 'timeSheets/getCalender?date=' + timesheetDate + '&orgId=' + orgId;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getUserWklyProjectAndTasks(userId: any, calenderId: any): Observable<any> {
    let url = 'weekly_tsm/getUserWklyProjectAndTasks?userId=' + userId + '&calId=' + calenderId;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getCommonProjectAndTasksForPmoTimesheets(calenderId: any, userId: any, orgId: any): Observable<any> {
    let url = 'weekly_tsm/getCommonProjectAndTasksForPmoTimesheets?calId=' + calenderId + 
    '&userId=' + userId + '&orgId=' + orgId ;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getShifts(orgId: any): Observable<any> {
    let url = 'weekly_tsm/shifts?orgId=' + orgId;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getUserWklyTimesheetEntry(userId: any, calenderId: any): Observable<any> {
    var url = 'weekly_tsm/getUserWklyTimesheetEntry?userId=' + userId + '&calId=' + calenderId;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getLookupbyName(lookupName: any): Observable<any> {
    let url = 'getLookupByLookupName/' + lookupName;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getApprovalTimesheets(projectResource): Observable<any> {
    var url = 'timeSheets/getApprovalTimesheets';
    return this.httpUtilities.post(AppConstants.appUrl + url, projectResource)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getTimeSheetForApproval(audit): Observable<any> {
    var url = 'auditLogs/getTimeSheetsWaitingForApproval';
    return this.httpUtilities.post(AppConstants.invoiceUrl + url, audit)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getAuditLogs(audit): Observable<any> {
    var url = 'auditLogs/getTimeSheetAuditLogs';
    return this.httpUtilities.post(AppConstants.invoiceUrl + url, audit)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  rejectPmoTimesheets(rejectTimesheetDTO): Observable<any> {
    var url = 'timeSheets/rejectAllPmoTimesheets';
    return this.httpUtilities.post(AppConstants.appUrl + url, rejectTimesheetDTO)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }


  rejectTimeSheetByProject(rejectTimesheetDTO): Observable<any> {
    var url = 'timeSheets/rejectAllPmoTimesheetsByProject';
    return this.httpUtilities.post(AppConstants.appUrl + url, rejectTimesheetDTO)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  submitTimeSheet(data, calendarId, orgId, empuserId): Observable<any> {
    var url = 'timeSheets/submitPmoTimeSheet?calendarId=' + calendarId + '&orgId=' + orgId + '&empuserId=' + empuserId;
    return this.httpUtilities.post(AppConstants.appUrl + url, data)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  deleteTimesheetEntry(timesheetId): Observable<any> {
    var url = 'weekly_tsm/deleteTimesheetEntry?timesheetId=' + timesheetId;
    return this.httpUtilities.delete(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error("error========", error);
    return Observable.throw(error || 'Failed in web api(Server error) ');
  }

}
