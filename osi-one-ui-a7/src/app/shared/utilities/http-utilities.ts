/**
 * Http Utilities
 */
import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Response,
  RequestOptionsArgs,
  URLSearchParams,
  RequestMethod,
  RequestOptions
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app-constants';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';

import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class HttpUtilities {
  excludeUrls = ['updateThumbnail', 'upload-isr-event-entries', 'upload-estimates','uploadDoccuments','updateDoccument'];

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private http: Http,
    private router: Router) {
  }

  public post(url: string, data?: Object): Observable<Object> {
    return this.request(url, {method: RequestMethod.Post}, data);
  }

  public put(url: string, data?: Object): Observable<Object> {
    return this.request(url, {method: RequestMethod.Put}, data);
  }

  public get(url: string): Observable<Object> {
    return this.request(url, {method: RequestMethod.Get});
  }

  public delete(url: string): Observable<Object> {
    return this.request(url, {method: RequestMethod.Delete});
  }

  private request(url: string, options: RequestOptionsArgs, body?: Object): Observable<Response> {
    options.headers = new Headers();

    if (body) {
      options.body = body;
    }

    if (this.checkUrl(url)) {
      options.headers.append(AppConstants.contentType, AppConstants.JSONContentType);
    }
	/*if(url.indexOf('upload-isr-event-entries')>-1){
	 options.headers.append('Content-Type', 'multipart/form-data');
	}*/
    options.headers.append('Auth_Token', localStorage.getItem('token'));
    options.headers.append('Proxy_User_Id', localStorage.getItem('proxyUserId'));
    return this.http.request(url, options)
      .map((response: any) => {

        if (response && response._body && response._body.length > 0) {
          return response.json();
        }
      });
  }

  public checkUrl(url: string): boolean {
    for (const excludeString of this.excludeUrls) {
      if (url.indexOf(excludeString) >= 0) {
        return false;
      }
    }
    return true;
  }

}