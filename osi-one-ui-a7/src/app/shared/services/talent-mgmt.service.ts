import { Injectable } from '@angular/core';
import {HttpUtilities} from '../utilities';
import {AppConstants} from '../app-constants';
import {Observable} from 'rxjs';

@Injectable()
export class TalentMgmtService {

  private readonly contextUrl = `${AppConstants.emsAppUrl}epms/talent-management`;

  constructor(
    private httpUtilities: HttpUtilities
  ) { }

  getAppraisalCycles(employeeId: number): Observable<any> {
    return this.httpUtilities.get(`${this.contextUrl}/get-appraisal-cycles?employeeId=${employeeId}`)
      .catch(this.handleError);
  }

  getReviewCycles(epmsHdrId: number): Observable<any> {
    return this.httpUtilities.get(`${this.contextUrl}/get-review-cycles?epmsHdrId=${epmsHdrId}`)
      .catch(this.handleError);
  }

  getEmployeeGoalsSummary(epmsHdrId: number, employeeId: number): Observable<any> {
      return this.httpUtilities.get(
        `${this.contextUrl}/get-employee-goals-summary?epmsHdrId=${epmsHdrId}&employeeId=${employeeId}`
      ).catch(this.handleError);
  }

  updateEmployeeGoalsStatus(epmsEmpDetails: any): Observable<any> {
    return this.httpUtilities.post(
      `${this.contextUrl}/update-employee-goals-status`,
      epmsEmpDetails
    ).catch(this.handleError);
  }

  handleError(error: Response) {
    return Observable.throwError(error.json());
  }
}
