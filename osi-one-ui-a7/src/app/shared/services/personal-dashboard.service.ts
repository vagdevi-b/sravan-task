import { Injectable } from '@angular/core';
import { HttpUtilities } from '../utilities';
import { AppConstants } from '../app-constants';
import { Observable } from 'rxjs';

@Injectable()
export class PersonalDashboardService {
  private appData = AppConstants;
  constructor(private httpUtilities: HttpUtilities) { }


  getLeavesList(): Observable<any> {
    const url = `${this.appData.appUrl}genericLeave/getEmployeeLeavesDetails`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }


  getStatusCodes(aliasName): Observable<any> {
  const url = `${this.appData.appUrl}config/statusCodes/${aliasName}`;
  return this.httpUtilities.get(url)
    .map((response: any) => {
      return response
    })
  }

  getWeeklyStatus(sysDate): Observable<any> {
    const url = `${this.appData.appUrl}timeSheets/getWeeklyStatus?sysDate=${sysDate}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  getResourcePendingTimeSheets(): Observable<any> {
    const url = `${this.appData.appUrl}timeSheets/getRMResourceTimeSheets`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  getWeeklyprojectStatus(sysDate): Observable<any> {
    const url = `${this.appData.appUrl}pmAcivity/getProjectsActivitiByEmpId?date=${sysDate}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  getEmployeeLeavesByRM(): Observable<any> {
    const url = `${this.appData.appUrl}leave/getAllEmployeeLeave`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  getExpensesToApprove(): Observable<any> {
    const url = `${this.appData.appUrl}managerexpenses/getAllExpensesByProject`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  getInvoicesForApproval(): Observable<any> {
    const url = `${this.appData.invoiceUrl}invoice/getInvoicesForApproval`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  getExpiringProjects(): Observable<any> {
    const url = `${this.appData.appUrl}project/projectsExpiring`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  // function getProjectResources(sysDate) {
  //   var url = "timeSheets/getProjectResources?sysDate=" + sysDate;

  getProjectResourceDetails(sysDate): Observable<any> { //timeSheets/getTimeSheetsByResource
    const url = `${this.appData.appUrl}timeSheets/getProjectResources?sysDate=${sysDate}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

    getTimeSheetApprovalResources(): Observable<any> {
      const url = `${this.appData.appUrl}timeSheets/getTimeSheetsByResource`;
      return this.httpUtilities.get(url)
        .map((response: any) => {
          return response
        })
    }

    getEmployeeRoles(): Observable<any> {
      const url = `${this.appData.appUrl}getEmployeeRoles`;
      return this.httpUtilities.get(url)
        .map((response: any) => {
          return response
        })
    }
}
