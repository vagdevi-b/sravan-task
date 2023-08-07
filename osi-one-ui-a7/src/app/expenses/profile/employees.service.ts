/**
 * Employees Service
 */
import {Injectable} from '@angular/core';
import { HttpUtilities } from '../../shared/utilities/http-utilities';
import {Observable} from "rxjs";
import { Headers, 
         Http, 
         Response, 
         RequestOptionsArgs, 
         URLSearchParams, 
         RequestMethod, 
         RequestOptions  } from '@angular/http';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';

import {  BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppConstants } from '../../shared/app-constants';

@Injectable()
export class EmployeeService {
  
  private appData = AppConstants;
    
  constructor(private httpUtilities: HttpUtilities ) {
  }
  
  getEmpDetails(): Observable<any> {    
    return this.httpUtilities.post(this.appData.appUrl + 'v1/employees/retrieve', JSON.stringify({"employeeId":6989,"searchDate":"2018-04-11"}));
  }  
  
  }
 
