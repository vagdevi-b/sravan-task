import { Injectable } from '@angular/core';
import { AppConstants } from '../app-constants';
import { HttpUtilities } from '../utilities';
import { Observable } from 'rxjs';

@Injectable()
export class TimesheetService {
  private appData = AppConstants;

  constructor(private httpUtilities: HttpUtilities) { }

  getProjectList(): Observable<any> {
    return this.httpUtilities.get(this.appData.appUrl + 'project/listOfProjects')
      .map((response: any) => response)
  }

  getProjectsByName(projectFilterObject): Observable<any> {
    return this.httpUtilities.post(this.appData.appUrl + 'project/projectByFilters', projectFilterObject)
      .map((response: any) => response)
  }

  getTaskListByProject(projectId: Number): Observable<any> {
    return this.httpUtilities.get(this.appData.appUrl + 'projectTask/projectTaskList?projectId=' + projectId + '&limit=&taskName=')
      .map((response: any) => response)
  }

  moveTimesheets(data: any): Observable<any> {
    return this.httpUtilities.post(this.appData.appUrl + 'timeSheets/moveTimesheets', data)
      .map((response: any) => response)
  }

  getProjectsForUser(userId): Observable<any> {
    return this.httpUtilities.get(this.appData.appUrl + 'timeSheets/projectsForUser?userId=' + userId)
      .map((response: any) => response)
  }

  getEmployeeDetails(tasks): Observable<any> {
    return this.httpUtilities.post(this.appData.appUrl + 'timeSheets/empDetailsByTasks?', tasks)
      .map((response: any) => {
        return response
      })
  }
}
