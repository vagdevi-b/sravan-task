
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
export class CreateHolidayService {

  private appData = AppConstants;
  private createHolidayCtx: string = "holiday/";
  data;
 
constructor(private httpUtilities: HttpUtilities) { }

getLocations(orgId): Observable<any> {
  //return this.httpUtilities.get(this.appData.appUrl + this.createHolidayCtx + 'getLocation')
  return this.httpUtilities.get(this.appData.emsAppUrl +'assignments/getAllLocations/'+orgId)
      .map((response: any) => response)
      .catch(this.handleError);
}

getOrganizationByEmployeeId(): Observable<any> {
  return this.httpUtilities.get(this.appData.appUrl + this.createHolidayCtx + 'getOrganizationByEmployeeId')
      .map((response: any) => response)
      .catch(this.handleError);
}


getHolidaysBasedOnLocation(locationId): Observable<any> {
  return this.httpUtilities.get(this.appData.appUrl + this.createHolidayCtx + 'getHolidaysBasedOnLocation?locationId='+locationId)
      .map((response: any) => response)
      .catch(this.handleError);
}

deleteHoliday(holidayId): Observable<any> {
  return this.httpUtilities.delete(this.appData.appUrl + this.createHolidayCtx + 'deleteHoliday?holidayId='+holidayId)
      .map((response: any) => response)
      .catch(this.handleError);
}

createHoliday(user): Observable<any>{
  return this.httpUtilities.post(this.appData.appUrl + this.createHolidayCtx + "saveHolidays", user)
  .map((response: any) => {
      return response;
  });
}

//getHolidaysList

getHolidayList(): Observable<any>{
  return this.httpUtilities.get(this.appData.appUrl + this.createHolidayCtx + "getHolidaysList")
  .map((response: any) => {
      return response;
  });
}

updateHoliday(user): Observable<any>{
  return this.httpUtilities.put(this.appData.appUrl + this.createHolidayCtx + "updateHolidays", user)
  .map((response: any) => {
      return response;
  });
}

getOrganizations(): Observable<any>{
  return this.httpUtilities.get(this.appData.emsAppUrl +"organizations", )
  .map((response: any) => {
      return response;
  });
}

getDateCheckedBasedOnLocation(year,locationId): Observable<any> {
  return this.httpUtilities.get(this.appData.appUrl + this.createHolidayCtx + 'getDateCheckedBasedOnLocation?holidayDate='+year+'&locationId='+locationId)
  .map((response: any) => response)
  .do(data => JSON.stringify(data))
  .catch(this.handleError);
  }

private handleError(error: Response) {
console.error("error========"+error);
return Observable.throw(error.json().error || 'Failed in web api(Server error) ');
}
}