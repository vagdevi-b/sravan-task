import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
//import { CONFIGURATION } from '../app.config';
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { HttpUtilities } from "../../utilities";
import { AppConstants } from "../../app-constants";
import { ToastrService } from 'ngx-toastr';
import { OsiIsrEventEntriesDTO } from "../../models/isr-event-definitions.model";

@Injectable({
  providedIn: 'root'
})
export class IsrEventDefinitionsService {
private appData = AppConstants;
  constructor(private httpUtilities: HttpUtilities, private toasterService: ToastrService, private http: HttpClient) { }
   getIsrEventDefinitions(webinarName, status): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "/isr/event-definitions/get-all-event-definitions?webinarName="+webinarName+"&status="+status
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  getIsrEventDefinitionById(eventDefId): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "/isr/event-definitions/get-event-definition/defid/"+eventDefId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  getEventDefinitionByName(webinarName): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "/isr/event-definitions/get-event-definition-by-name?webinarName="+webinarName
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  
    getEventNotificationRulesByEventDefId(eventDefId): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "/isr/event-definitions/get-event-notification-rule?defid="+eventDefId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
    getEventEntriesByEventDefId(eventDefId): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.emsAppUrl + "/isr/event-definitions/get-event-entries?defid="+eventDefId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
   
  saveIsrEventDefinition(body: any): any {
    return this.httpUtilities
      .post(this.appData.emsAppUrl + '/isr/event-definitions/', body)
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
    deleteEventDefinitions(eventDefId): any {
    return this.httpUtilities
      .delete(this.appData.emsAppUrl + '/isr/event-definitions/delete-event-definitions/defid/'+eventDefId)
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  publishEvent(body: any): any {
    return this.httpUtilities
      .post(this.appData.emsAppUrl + '/isr/event-definitions/publish-event', body)
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
    deleteEventEntries(body: any): any {
    return this.httpUtilities
      .post(this.appData.emsAppUrl + '/isr/event-definitions/delete-event-entries', body)
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
  getEventEntriesFromSalesForce(body: any): any {
    return this.httpUtilities
      .post(this.appData.emsAppUrl + '/isr/event-definitions/get-event-entries-salesforce', body)
      .map((response: any) => response)
      .catch(this.handleError);
  }
  
    uploadFile(file: File, eventDefId: any): any{
		const formdata: FormData = new FormData();
    formdata.append('file', file);
	formdata.append('eventDefId', eventDefId);
     return this.httpUtilities.post(this.appData.emsAppUrl + '/isr/event-definitions/upload-isr-event-entries', formdata)
	  .map((response: any) => response)
      .catch(this.handleError); 
  }

  getEventEntriesReport(eventType: string, startDate: string, endDate: string): Observable<any> {
    return this.httpUtilities
      .get(`${this.appData.emsAppUrl}isr/event-definitions/type/${eventType}/from/${startDate}/to/${endDate}`)
      .map((response: OsiIsrEventEntriesDTO []) => response)
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
