import { NgBlockUI, BlockUI } from "ng-block-ui";
import { HttpUtilities } from "../shared/utilities";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { AppConstants } from "../shared/app-constants";
import { Injectable } from "@angular/core";
import { ProjectActivitiesData } from "../shared/utilities/ProjectActivitiesData";

@Injectable()
export class ProjectService {
  @BlockUI() blockUI: NgBlockUI;
  constructor(private _http: HttpUtilities, private http: Http) {}

  getProjectsByUserId() {
    return this._http
      .get(AppConstants.appUrl + "pmAcivity/getProjectsByEmpId")
      .map((response: any[]) => response);
    //.catch(this.handleError);
  }
  getProjectsByMngrId() {
    return (
      this._http
        .get(AppConstants.appUrl + "pmAcivity/getProjectsByProjMgnrId")
        // .get(
        //   "http://localhost:8090/tsm-api/api/pmAcivity/getProjectsByProjMgnrId"
        // )
        .map((response: any[]) => response)
    );
  }
  getCalendarByYearAndMonth(year, month) {
    return this._http
      .get(
        AppConstants.appUrl +
          "pmAcivity/getCalenderByMonth/" +
          year +
          "/" +
          month
      )
      .map((response: any[]) => response)
      .catch(this.handleError);
  }
  saveProjectActivity(ProjectActivity) {
    return this._http
      .post(AppConstants.appUrl + "pmAcivity/saveProjActivity", ProjectActivity)
      .map((response: ProjectActivitiesData) => response);
    //.catch(this.handleError);
  }
  getProjActivity(projectId, calenderId) {
    return this._http
      .get(
        AppConstants.appUrl +
          "pmAcivity/getProjActivity/" +
          projectId +
          "/" +
          calenderId
      )
      .map((response: ProjectActivitiesData) => response);
    //.catch(this.handleError);
  }

  public getproject() {
    return this.http.get("./assets/mydata.json").map((res: any) => res.json());
  }
  getMilestones(projectId) {
    return this._http
      .get(AppConstants.appUrl + "pmAcivity/getMilestoneAndActivity/" + projectId)
      .map((response: any[]) => response);
    // .catch(this.handleError);
  }

  getProjectRisks() {
    return this._http
      .get(AppConstants.appUrl + "pmAcivity/getProjectRiskTypes")
      .map((response: any[]) => response);
    //.catch(this.handleError);
  }
   downloadPMActivityPDF(projectId,calendarId) {
    return this._http
      .get(AppConstants.appUrl + "pmAcivity/getpdf/"+projectId+ "/"+calendarId)
      .map((response:any) => response);
    //.catch(this.handleError);
  }
   
  /* estimations */
  getProjects(){
	  return this._http
      .get(AppConstants.appUrl + "weekly_tsm/getAllProjectList")
      .map((response: any[]) => response);
  }
  getOrganizations(){
	  return this._http
      .get(AppConstants.emsAppUrl + "organizations")
      .map((response: any[]) => response);
  }
  
  getEmployeeTitles(){
	  return this._http
      .get(AppConstants.appUrl + "estimates/get-titles")
      .map((response: any[]) => response);
  }
  
  getPractices(){
	  return this._http
      .get(AppConstants.appUrl + "estimates/get-practices")
      .map((response: any[]) => response);
  }
  getSubPractices(practiceId){
	  return this._http
      .get(AppConstants.appUrl + "estimates/get-sub-practices/"+practiceId)
      .map((response: any[]) => response);
  }
  getSows(projectId){
	  return this._http
      .get(AppConstants.appUrl + "invrecognition/get-sow-details/"+projectId)
      .map((response: any[]) => response);
  }
  getEstimations(projectId, sowId, year){
	  return this._http
      .get(AppConstants.appUrl + "estimates/get-estimate-details/projectid/"+projectId+"/sowid/"+sowId+"/year/"+year)
      .map((response: any[]) => response);
  }
  
  uploadFile(file: File, projectId: any, sowId: any): any{
		const formdata: any = new FormData();
    formdata.append('file', file);
	formdata.append('projectId', parseInt(projectId));
	formdata.append('sowId', parseInt(sowId));
     return this._http.post(AppConstants.appUrl + '/estimates/upload-estimates', formdata)
	  .map((response: any) => response)
      .catch(this.handleError); 
  }
    saveEstimations(estimations) {
    return this._http
      .post(AppConstants.appUrl + "estimates/save-estimations", estimations)
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
		const errorInfo = JSON.parse(error['_body']);
    console.error("error========" + errorInfo['errorMessage']);
    return Observable.throw( 
      errorInfo['errorMessage'] || "Please contact administrator "
    );
  }
}
