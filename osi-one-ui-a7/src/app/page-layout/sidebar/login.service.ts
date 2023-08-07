/**
 * Login Service
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';
import { Http, Headers, Response } from '@angular/http';

import { AppConstants } from '../../shared/app-constants';
import { EventEmitter } from 'events';
import { HttpUtilities } from '../../shared/utilities';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private appData = AppConstants;

  private FAVOURITES_GET_ALL_URL = `${this.appData.emsAppUrl}menu-favourites/getAll`;
  private FAVOURITES_UPDATE_URL = `${this.appData.emsAppUrl}menu-favourites/updateMultiple`;
  private VALIDATE_TOKEN_URL = `${this.appData.emsAppUrl}validate-token`;

  public userData: any;

  private validateTokenPromise: Promise<void> = undefined;

  constructor(private http: Http, private httpUtilities: HttpUtilities) {
  }

  getNewMenus(): Promise<void> {

    return new Promise((resolve, reject) => {
      this.httpUtilities.get(this.FAVOURITES_GET_ALL_URL)
        .subscribe(response => {
          localStorage.setItem('favMenu', JSON.stringify(response));
          resolve();
        });
    });
  }

  getMenus(): Promise<void> {

    if (!this.validateTokenPromise) {
      this.validateTokenPromise = new Promise((resolve, reject) => {

        this.httpUtilities.get(this.VALIDATE_TOKEN_URL)
          .subscribe((response: any) => {
            localStorage.setItem('photoPath', response.photoPath);
            localStorage.setItem('menuTree', response.menuTree);
            localStorage.setItem('userName', response.fullName);
            localStorage.setItem('orgCode', response.orgCode);
            localStorage.setItem('orgId', response.orgId);
            localStorage.setItem('userInfo', response.userName);
            resolve();
          });
      });
    }

    return this.validateTokenPromise;
  }

  saveFavourites(menu): Observable<any> {
    return this.httpUtilities.post(
      this.FAVOURITES_UPDATE_URL,
      menu
    );
  }
}
