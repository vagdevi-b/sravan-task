
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
//import { CONFIGURATION } from '../app.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpUtilities } from '../../utilities';
import { AppConstants } from '../../app-constants';
import {map, tap} from 'rxjs/operators';


@Injectable()
export class AppraisalService {
  private appData = AppConstants;
  public empSelfRating:number = 0;
  public empOverallRating:number = 0;
  public epmsStatus = '';
  public totalCount = 0;
  public acceptedCount = 0;
  public breadcrumbText = '';

  private indirectReportersGoalsSummary: any[];
  public previousEpmsHdrId: number;

  // minimum rating allowed
  readonly minAllowedRating = 0;

  // maximum allowed rating
  maxAllowedRating: number;

  /*
   * If this is true, employee goals setting page will be read only.
   *
   * So, when navigating to employee goals setting page, this should
   * be modified accordingly using the SETTER setIsGoalsPageReadOnly
   * */
  private isGoalsPageReadOnly: boolean;

  constructor(private httpUtilities: HttpUtilities) { }

  getIsGoalsPageReadOnly() {
    return this.isGoalsPageReadOnly;
  }

  setIsGoalsPageReadOnly(value: boolean) {
    this.isGoalsPageReadOnly = value;
  }

  getEmployeeSuggestion(mail): Observable<any> {
    return this.httpUtilities.post(`${this.appData.appUrl}assignments/searchEmployeeByEmpName/${mail}`)
      .map((response: any) => {
        return response
      })
  }

  getOrganizations(): Observable<any> {
    return this.httpUtilities.get(`${this.appData.emsAppUrl}organizations`)
      .map((response: any) => {
        return response;
      });
  }

  getEmployeeSelfGoalDetails(epmsHdrId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/dashboard/get-my-goals-summary/hdrid/${epmsHdrId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getEmployeeTeamGoalDetails(obj): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/getEmployeeTeamGoalDetails`
    return this.httpUtilities.post(url, obj)
      .map((response: any) => {
        return response
      });
  }


  getReviewCycleList(): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/hdr/get-all-emps-headers`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getReviewCycleById(id): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/hdr/get-epms-headers/hdrid/${id}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  initiateApprisal(obj,updateStatusFlag,remainEmpStatus): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/hdr/updateStatusFlag/${updateStatusFlag}?remainEmpStatus=${remainEmpStatus}`
    return this.httpUtilities.post(url, obj)
      .map((response: any) => {
        return response
      });
  }


  getAppraisalCycleYears(orgId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/apprisalcycle/orgId/0`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getReviewCycleForAppraisalYear(epmsHdrId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/apprisalcycle/get-review-cycles/epmshdrid/${epmsHdrId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getTeamGoalsList(epmsHdrId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/dashboard/get-my-team-goals-summary/hdrid/${epmsHdrId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getProjectsList(empId, epmsHdrId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-project-weightage/empid/${empId}/epmshdrid/${epmsHdrId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  getProjectGoals(empId, epmsHdrId, projectId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-project-goals/empid/${empId}/projectid/${projectId}/epmshdrid/${epmsHdrId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  getCategoryInfo(categoryName): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/categories/categoryName/${categoryName}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  saveProjectGoals(projectInfo): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/set-project-goals`;
    return this.httpUtilities.put(url, projectInfo)
      .map((response: any) => {
        return response
      });
  }

  getProjectManagers(projectid, empId, rmPmId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-proxy-managers/projectid/${projectid}/empid/${empId}/rmpmid/${rmPmId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getRatingsList(): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/kpi/get-epms-kpi`;
    return this.httpUtilities.get(url)
      .pipe(
        tap(response => {

          this.maxAllowedRating = Math.max(
              ...response.map(each => each.rating)
            );
        })
      );
  }

  getGradesList(orgId): Observable<any> {
    const url = `${this.appData.emsAppUrl}assignments/getAllGrades/${orgId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  getJobTitleList(orgId): Observable<any> {
    const url = `${this.appData.emsAppUrl}assignments/getAllJobCodes/${orgId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }


  savePerformanceAreas(info): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/set-career-org-goals`;
    return this.httpUtilities.put(url, info)
      .map((response: any) => {
        return response
      });
  }

  getEmployeeDevelopmentInfo(empid, epmsHdrId, isFrom): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-career-org-goals/empid/${empid}/type/${isFrom}/epmshdrid/${epmsHdrId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getOrgEmployeeDevelopmentInfo(empid, epmsHdrId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-career-org-goals/empid/${empid}/type/ORGANIZATION/epmshdrid/${epmsHdrId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  updateProjectWeight(projectInfo): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/set-project-weightage`;
    return this.httpUtilities.put(url, projectInfo)
      .map((response: any) => {
        return response
      });
  }

  getSelfandOverAllRating(empid, epmsHdrId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-employee-consolidated-ratings/empid/${empid}/epmshdrid/${epmsHdrId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  getLoadTemplateInfo(practiceId, gradeId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/template/get-epms-template/practice/${practiceId}/grade/${gradeId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  getPracticeList(): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/practice/get-all-practices`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  getTabsWiseWeightage(empId, epmsHeaderId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-career-org-weightage/empid/${empId}/epmshdrid/${epmsHeaderId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  updateTabsWeight(weightageInfo): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/set-epms-weightage`;
    return this.httpUtilities.put(url, weightageInfo)
      .map((response: any) => {
        return response
      });
  }
  getEmployeeListByOrg(orgId,remainEmpStatus): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/template/get-employees/orgid/${orgId}/remainEmpStatus/${remainEmpStatus}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  getAllEmployeesList(employeeId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-all-active-employees/epmid/${employeeId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  initiateRatings(epmsEmpDetId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/initiate-ratings`;
    return this.httpUtilities.put(url, epmsEmpDetId)
      .map((response: any) => {
        return response
      });
  }
  getEmployeeStatusInfo(employeeId, epmsemphdrid): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/get-all-status/epmsemphdrid/${epmsemphdrid}/empid/${employeeId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getEmployeeTimeSheets(): Observable<any> {
    const url = `${this.appData.appUrl}weekly_tsm/getEmployeeTimeSheets`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }


  updateKpaInfo(kpaInfo) {
    const url = `${this.appData.emsAppUrl}/epms/goals/save-epms-emp-kpa-progress`;
    return this.httpUtilities.put(url, kpaInfo)
      .map((response: any) => {
        return response
      });
  }

  getProjectEmployees(projectId, epmsemphdrid, employeeId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/template/get-employees-by-project-goals/projectid/${projectId}/epmshdrid/${epmsemphdrid}/empid/${employeeId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getOrgCareerEmployeeGoalsInfo(categoryid, epmsemphdrid, epmId): Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/template/get-employees-by-career-org-goals/categoryid/${categoryid}/epmshdrid/${epmsemphdrid}/empid/${epmId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }

  getHistoryInfo(epmsEmpDetId):Observable<any> {
    const url = `${this.appData.emsAppUrl}epms/goals/getEpmsAuditLogs?sourceId=${epmsEmpDetId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      });
  }
  checkKpaNamesDuplicates(names): any {
    var uniq = names
      .map((name) => {
        return {
          count: 1,
          name: name
        }
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count
        return a
      }, {})

    const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
    return duplicates;
  }
  getStatusDescription(statusInfo): any {
    let statusValue = '';
    switch (statusInfo) {
      case 'RM INITIATED':
        statusValue = 'Initiated';
        break;
      case 'DRAFT':
        statusValue = 'Draft';
        break;
      case 'PM DRAFT':
        statusValue = 'Initiated';
        break;
      case 'INITIATED':
        statusValue = 'Sent for Employee Agreement';
        break;
      case 'EMP INITIATED':
        statusValue = 'Sent for Employee Agreement';
        break;
      case 'EMP ACCEPTED':
        statusValue = 'Self Review to Initiate';
        break;
      case 'RATING INITIATED':
        statusValue = 'Self Review';
        break;
      case 'EMP REVIEWED':
        statusValue = 'Manager Review';
        break;
      case 'RM REVIEWED':
        statusValue = 'Sent for Employee Acceptance';
        break;
      case 'CLOSED':
        statusValue = 'Closed';
        break;
      default:
          statusValue = '';
        break;
    }
    return statusValue;
  }

  /**
   * Retrieves the goals summary of all indirectly reporting employees
   * and stores it in a private field and makes it available
   * via a getter and setter.
   *
   * The data is only fetched when that field is undefined.
   * Subsequent calls return the already fetched data */
  getIndirectReportersGoalsSummary(epmsHdrId): Promise<any> {
    return new Promise((resolve, reject) => {

      if (this.indirectReportersGoalsSummary) {
        resolve(this.indirectReportersGoalsSummary);
      }
      else {
        const url = `${this.appData.emsAppUrl}epms/dashboard/getIndirectReportersGoalsSummary/hdrId/${epmsHdrId}`;

        this.httpUtilities.get(url)
          .subscribe(
            (response: any[]) => {
              this.indirectReportersGoalsSummary = response;

              // since this list contains all indirect reporting employees,
              // all tabs like career and organization should also be shown
              this.indirectReportersGoalsSummary.map(
                each => each.isProjectResource = 'No'
              );

              resolve(this.indirectReportersGoalsSummary);
            },
            error => reject(error)
          );
      }

    });
  }

  resetIndirectReportersGoalsSummary() {
    this.indirectReportersGoalsSummary = undefined;
  }

  /** Returns true if a rating is INVALID else false
   **/
  isRatingInvalid(rating: number) {
    return rating === null
      || rating === undefined
      || rating < this.minAllowedRating
      || rating > this.maxAllowedRating;
  }

  /**
   * For each kpa, sets the self and PmRm rating to 0 if they are null
   * */
  setDefaultRating(epmsEmpDetails: any) {
    if (
      !epmsEmpDetails
      || !epmsEmpDetails.osiEpmsEmpDetails
      || !(epmsEmpDetails.osiEpmsEmpDetails instanceof Array)
    ) {
      return;
    }

    for (const eachDetail of epmsEmpDetails.osiEpmsEmpDetails) {
      if (
        !eachDetail.osiEpmsEmpKraDetails
        || !(eachDetail.osiEpmsEmpKraDetails instanceof Array)
      ) {
        continue;
      }
      for (const eachKraDetail of eachDetail.osiEpmsEmpKraDetails) {
        if (
          !eachKraDetail.osiEpmsEmpKpaDetails
          || !(eachKraDetail.osiEpmsEmpKpaDetails instanceof Array)
        ) {
          continue;
        }
        for (const eachKpaDetail of eachKraDetail.osiEpmsEmpKpaDetails) {
          if (eachKpaDetail.empSelfRating === null) {
            eachKpaDetail.empSelfRating = 0;
          }
          if (eachKpaDetail.empPmRmRating === null) {
            eachKpaDetail.empPmRmRating = 0;
          }
        }
      }
    }
  }
}


