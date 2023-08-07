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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';

@Injectable()
export class EmployeeResignationService {
  private appData = AppConstants;
  private leaveRequestServiceCtx: string = "leave/";

  constructor(private httpUtilities: HttpUtilities, private httpclient: HttpClient) { }


  getemployeedetails(): Observable<any> {
    return this.httpUtilities.get("")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getresignationtypes(): Observable<any> {
    return this.httpUtilities.get("")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getdependencytypes(): Observable<any> {

    return this.httpUtilities.get("")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getallreasonsdata(): Observable<any> {
    return this.httpUtilities.get(this.appData.emsAppUrl + "getLookupByLookupName/RESIGNATION_REASON")
  }


  getresignationrequest(requestId): Observable<any> {
    return this.httpUtilities.get(this.appData.resignationUrl + "request/RM/" + requestId)
      .map((response: any) => response);
  }


  getallresignationdata(obj, pageNumber, pageSize): Observable<any> {
    let url = `${this.appData.resignationUrl}request/list?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.httpUtilities.post(url, obj)
      .map((response: any) => {
        return response;
      })
  }

  saveNotes(obj): Observable<any> {

    let url = `${this.appData.resignationUrl}request-notes/save`;
    return this.httpUtilities.post(url, obj)
      .map((response: any) => {
        return response;
      });
  }

  saveResignationRequest(obj) {
    let url = `${this.appData.resignationUrl}request/update`;
    return this.httpUtilities.put(url, obj)
      .map((response: any) => {
        return response;
      });
  }

  updatePd(obj) {
    let url = `${this.appData.resignationUrl}request/update/PD`;
    return this.httpUtilities.put(url, obj)
      .map((response: any) => {
        return response;
      });
  }

  updateHr(obj) {
    let url = `${this.appData.resignationUrl}request/update/HR`;
    return this.httpUtilities.put(url, obj)
      .map((response: any) => {
        return response;
      });
  }

  saveReasons(obj): Observable<any> {
    let url = `${this.appData.resignationUrl}request-details/save`;
    return this.httpUtilities.post(url, obj)
      .map((response: any) => {
        return response;
      });
  }


  updateReasons(obj): Observable<any> {
    let url = `${this.appData.resignationUrl}request-details/update`;
    return this.httpUtilities.put(url, obj)
      .map((response: any) => {
        return response;
      });
  }

  saveAttachment(data) {
    let headers = new HttpHeaders();
    headers = headers.set("Auth_Token", localStorage.getItem('token'))
      .set("Proxy_User_Id", localStorage.getItem('proxyUserId'));
    let url = `${this.appData.resignationUrl}request-attachments/upload`;
    return this.httpclient.post(url, data, { headers: headers })
      .map((response: any) => {
        return response;
      });
  }


  saveAllService(data) {
    let headers = new HttpHeaders();
    headers = headers.set("Auth_Token", localStorage.getItem('token'))
      .set("Proxy_User_Id", localStorage.getItem('proxyUserId'));
    let url = `${this.appData.resignationUrl}request/save/all`;
    return this.httpclient.post(url, data, { headers: headers });

  }


  getrequestdata(requestId): Observable<any> {
    return this.httpUtilities.get(this.appData.resignationUrl + "request/" + "all/" + requestId)
      .map((response: any) => response);
  }

  getOrganizations(): Observable<any> {
    return this.httpUtilities.get(this.appData.emsAppUrl + "organizations")
      .map((response: any) => response);
  }


  getBusinessUnits(): Observable<any> {
    return this.httpUtilities.get(this.appData.appUrl + "config/" + "businessunits")
      .map((response: any) => response);
  }


  getDependantData(obj): Observable<any> {
    let url = `${this.appData.emsAppUrl}assignments/loadRollupsPopup`;
    return this.httpUtilities.post(url, obj)
      .map((response: any) => {
        return response;
      });
  }

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error("error========" + error);
    return Observable.throw(error.json().error || 'Failed in web api(Server error)');
  }

  getPager(totalItems: number, totalPages: any, pageSize: number, currentPage: number = 1): any {
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    // let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    const a = (startIndex) + (+pageSize) - 1;
    const b = totalItems - 1;
    const endIndex = Math.min(a, b);
    // create an array of pages to ng-repeat in the pager control
    const pages = _.range(startPage, endPage + 1);
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  informEmployee(empId) {
    let url = `${this.appData.resignationUrl}request/sendMail/${empId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => response);

  }

}
