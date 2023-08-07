import { Injectable } from '@angular/core';
import { HttpUtilities } from '../utilities';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app-constants';

@Injectable()
export class DepartmentMappingService {
  private appData = AppConstants;
  constructor(private httpUtilities: HttpUtilities) { }

  OrganizationList(): Observable<any> {
    return this.httpUtilities.get(this.appData.emsAppUrl + 'organizations')
        .map((response: any) => response)
        .catch(this.handleError);
  }

  buList(){
    let search = {};
    return this.httpUtilities.post(this.appData.emsAppUrl + 'list/osibusinessunits/searchOsiBusinessUnits',search)
    .map((response: any) => response)
    .catch(this.handleError);
  }

  regionList(){
    return this.httpUtilities.get(this.appData.emsAppUrl + 'regions')
    .map((response: any) => response)
    .catch(this.handleError);
  }

  practiceList(){
    let search = {};
    return this.httpUtilities.post(this.appData.emsAppUrl + 'list/osicostcenter/searchOsiCostCenter',search)
    .map((response: any) => response)
    .catch(this.handleError);
  }

  subPracticeList(){
    let search = {};
    return this.httpUtilities.post(this.appData.emsAppUrl + 'osisubpractice/list',search)
    .map((response: any) => response)
    .catch(this.handleError);
  }
  

  departmentList(){
    let search = {};
    return this.httpUtilities.post(this.appData.emsAppUrl + 'list/osidepratment/searchOsiDepratment',search)
    .map((response: any) => response)
    .catch(this.handleError);
  }

  //localhost:8080
  createDeptMapping(newData){
    return this.httpUtilities.post( this.appData.emsAppUrl +'/departments/save',newData)
    .map((response: any) => response)
    .catch(this.handleError);
  }
  updateDeptMapping(updatedData){
    return this.httpUtilities.put(this.appData.emsAppUrl +'/departments/update',updatedData)
    .map((response: any) => response)
    .catch(this.handleError);
  }
  getDeptMappingbyId(id){
    return this.httpUtilities.get(this.appData.emsAppUrl +'/departments//{id}')
    .map((response: any) => response)
    .catch(this.handleError);
  }
  getAllDeptMapping(searchData){
    // http://localhost:8080/ems-api/api/departments/osi/getAll
    return this.httpUtilities.post(this.appData.emsAppUrl +'/departments/osi/getAll',searchData)
    .map((response: any) => response)
    .catch(this.handleError);
  }
  deleteDeptMapping(id){
    console.log(id);
    
    return this.httpUtilities.delete(this.appData.emsAppUrl + 'departments//'+id)
    .map((response: any) => response)
    .catch(this.handleError);
  }












  
private handleError(error: Response) {
  console.error("error========"+error);
  return Observable.throw(error.json().error || 'Failed in web api(Server error) ');
  }
}
