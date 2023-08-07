import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { OptionalType } from "./../../shared/utilities/optionalType";

//import { CONFIGURATION } from '../app.config';
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { HttpUtilities } from "../utilities";
import { AppConstants } from "../app-constants";

@Injectable()
export class AccuralRuleService {


   
  
  
  private appData = AppConstants;
  private createAccuralCtx: string = "leaveAccurual/";
  data;

  constructor(private httpUtilities: HttpUtilities) {}

  getOrganizationByEmployeeId(): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.appUrl +
          this.createAccuralCtx +
          "getOrganizationByEmployeeId"
      )
      .map((response: any) => { 
        console.log("---getOrganizationByEmployeeId---"  );
        console.log(response);
        
        return response
      })
      .catch(this.handleError);
  }

  getLocations(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl + this.createAccuralCtx + "getLocations")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  // orgnaizations

  getAllOrganization() : Observable<any[]> {
    return this.httpUtilities.get(this.appData.appUrl+'orgnaizations')
    .map((response:any[])=> response);
  }

  getLocationByOrgId(id): Observable<any[]> {
    return this.httpUtilities.get(this.appData.appUrl+'locations/'+id)
    .map((response:any[])=> response);
  }

  getLocByLocationId(locationId) : Observable<any[]> {
    return this.httpUtilities.get(this.appData.appUrl+'locationsById/'+locationId)
    .map((response:any[])=> response);
  }

  getLeaveTypes(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl +"leave/getLeavesType")
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
   getEmployeeStatusList(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl +"leaveAccurual/getEmployeeStatus")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  /* getEmployeeStatus(): Observable<any> {
    return this.httpUtilities.get(this.appData.appUrl + this.createAccuralCtx + 'getEmployeeStatus')
    .map((response: any) => response)
    .catch(this.handleError);
    } */

  getRuleIBoundPeriod(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl + this.createAccuralCtx + "getRuleIBoundPeriod")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getRuleUBoundPeriod(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl + this.createAccuralCtx + "getRuleUBoundPeriod")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getEmployeeLevel(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl + this.createAccuralCtx + "getEmployeeLevel")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getAccrualIntervalDetails(): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.appUrl +
          this.createAccuralCtx +
          "getAccrualIntervalDetails"
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getLeaveAccrualRules(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl + this.createAccuralCtx + "getLeaveAccrualRules")
      .map((response: any) =>
        console.log("---getLeaveAccrualRules----" + response)
      )
      .catch(this.handleError);
  }

  saveLeaveAccurals(user): Observable<any> {
    console.log("saveLeaveAccurals  :: AccuralRulesServices......." + user);
    return this.httpUtilities
      .post(
        this.appData.appUrl + this.createAccuralCtx + "saveLeaveAccrual",
        user
      )
      .map((response: any) => {
        console.log("Leave Accural Testing....." + user);
        return response;
      });
  }

  updateLeaveAccurals(user): Observable<any> {
   
    console.log("saveLeaveAccurals  :: AccuralRulesServices......." + user);
    return this.httpUtilities
      .put(
        this.appData.appUrl + this.createAccuralCtx + "updateLeaveAccural",
        user
      )
      .map((response: any) => {
        return response;
      });
    
  }

  getAccuralPeriodInterval(): Observable<any> {
    return this.httpUtilities
      .get(this.appData.emsAppUrl + "getLookupByLookupName/ACCRUAL_INTERVAL")
      .map((response: any) => {
        return response;
      });
  }

  getAccruals() : Observable<any>{
    return this.httpUtilities
      .get(this.appData.appUrl + this.createAccuralCtx +'getLeaveAccrualRuleDetails')
      .map((response: any) => {
        console.log(response);
        return response;
      });
  }

  getAccrualsByruleId(id): Observable<any> {
    return this.httpUtilities
      .get(this.appData.appUrl + this.createAccuralCtx +'getLeaveAccrualRule?ruleId='+id)
      .map((response: any) => {
        return response;
      });
  }


  private handleError(error: Response) {
    console.error("error========" + error);
    return Observable.throw(
      error.json().error || "Failed in web api(Server error) "
    );
  }

}
