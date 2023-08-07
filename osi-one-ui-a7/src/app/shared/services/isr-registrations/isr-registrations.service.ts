import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
//import { CONFIGURATION } from '../app.config';
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { HttpUtilities } from "../../utilities";
import { AppConstants } from "../../app-constants";

@Injectable({
  providedIn: 'root'
})
export class IsrRegistrationsService {
private appData = AppConstants;
  constructor(private httpUtilities: HttpUtilities) { }
   getIsrRegistrations(employeeId, employeeName, countryCode, stateCode, cityCode): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "isr/registrations/get-all-isr-registrations?employeeId="+employeeId+"&employeeName="+employeeName+"&countryCode="+countryCode+"&stateCode="+stateCode+"&cityCode="+cityCode
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  getIsrRegistrationById(isrRegId): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "isr/registrations/get-isr-registration/regid/"+isrRegId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
   
  saveIsrRegistration(body: any): any {
    return this.httpUtilities
      .post(this.appData.emsAppUrl + 'isr/registrations/', body)
      .map((response: any) => response)
      .catch(this.handleError);
  }
  getActiveEmployees(employeeName): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "isr/registrations/get-active-employees?employeeName="+employeeName
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  getCountries(): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "isr/registrations/get-all-countries"
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  getStatesbyCountryCode(countryCode): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "isr/registrations/get-states-by-country/"+countryCode
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  getCititesbyStateName(stateName): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "isr/registrations/get-cities-by-state/"+stateName
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
		const errorInfo = JSON.parse(error['_body']);
    console.error("error========" + errorInfo['errorMessage']);
    return Observable.throw(
      errorInfo['errorMessage'] || "Failed in web api(Server error) "
    );
  }
}
