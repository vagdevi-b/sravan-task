import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpUtilities } from '../shared/utilities';
import { AppConstants } from '../shared/app-constants';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class GridService {
  private appData = AppConstants;
  userData$ = new BehaviorSubject<any>(null);
  filters$ = new BehaviorSubject<any>(null);
  filters: any;
  widgetId: any;

  constructor(public http: Http, private httpUtilities: HttpUtilities) { }

  getWidgetsList(): Observable<any> {
    const url = `${this.appData.invoiceUrl}dashboard/widget/getAll`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  createWidget(req): Observable<any> {
    const url = `${this.appData.invoiceUrl}dashboard/employee/widget`;
    return this.httpUtilities.post(url, req)
      .map((response: any) => {
        return response
      })
  }

  getEmpWidgets(): Observable<any> {
    const url = `${this.appData.invoiceUrl}dashboard/employee/widget/getAll`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  uploadFile(file: File): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.httpUtilities.post(this.appData.invoiceUrl + 'dashboard/employee/widget/updateThumbnail', formdata);
  }

  setThumbnail(value: any): any {
    this.userData$.next(value);
  }

  getThumbnail(): Observable<any> {
    return this.userData$.asObservable();
  }

  setFilters(filters: any): any {
    // this.filters$.next(filters)
    this.filters = filters;
  }

  // getFilters(): Observable<any> {
  //   return this.filters$.asObservable();
  // }

  getFilters(): any {
    return this.filters;
  }

  setWidgetId(id: any): any {
    this.widgetId = id;
  }

  getWidgetId(): any {
    return this.widgetId;
  }

  getEmpReportByWidgetId(widgetId): Observable<any> {
    const url = `${this.appData.invoiceUrl}dashboard/employee/report/getReport/${widgetId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response
      })
  }

  saveEmployeeReport(req: any): Observable<any> {
    const url = `${this.appData.invoiceUrl}dashboard/employee/report`;
    return this.httpUtilities.post(url, req)
      .map((response: any) => {
        return response
      })
  }

  //http://192.168.32.63:8080/tsm-api/dashboard/widget/getAll
  //employee/report/getAll

  getJson(): any {
    return [
      {
        'created_on': '2019-11-25T05:31:10.390Z',
        'created_by': 'Admin',
        'modified_on': '2019-11-25T05:31:10.390Z',
        'id': 3,
        'imageUrl': 'assets/osione1.png',
        'title': 'Hours By Project',
        'type': 'tableWidget',
        'name': 'Project',
        'status': true,
        'is_visible': true,
        'version': 0,
        'seq_num': 1,
        'widget_setting': {
          'created_on': '2019-11-25T05:31:27.283Z',
          'created_by': 'Admin',
          'modified_on': '2019-11-25T05:31:27.283Z',
          'modified_by': 'Admin',
          'id': 1,
          'enable_settings': '1',
          'is_resizable': true,
          'is_movable': true,
          'is_minimizable': true,
          'is_maximizable': true,
          'is_closable': true,
          'refresh_interval_sec': 0,
          'version': 0
        }
      },
      {
        'created_on': '2019-11-25T05:31:10.390Z',
        'created_by': 'Admin',
        'modified_on': '2019-11-25T05:31:10.390Z',
        'imageUrl': 'assets/osirevenue.png',
        'title': 'Hours By Resources',
        'id': 4,
        'type': 'listingWidget',
        'name': 'Resources',
        'status': true,
        'is_visible': true,
        'version': 0,
        'seq_num': 2,
        'widget_setting': {
          'created_on': '2019-11-25T05:31:27.283Z',
          'created_by': 'Admin',
          'modified_on': '2019-11-25T05:31:27.283Z',
          'modified_by': 'Admin',
          'is_hrp_load': false,
          'id': 2,
          'enable_settings': '1',
          'is_resizable': true,
          'is_movable': true,
          'is_minimizable': true,
          'is_maximizable': true,
          'is_closable': true,
          'refresh_interval_sec': 0,
          'version': 0
        }
      },
      {
        'created_on': '2019-11-25T05:31:10.390Z',
        'created_by': 'Admin',
        'modified_on': '2019-11-25T05:31:10.390Z',
        'imageUrl': 'assets/osione1.png',
        'title': 'Invoiced Revenue By Customer',
        'id': 4,
        'type': 'listingWidget',
        'name': 'Customer',
        'status': true,
        'is_visible': true,
        'version': 0,
        'seq_num': 2,
        'widget_setting': {
          'created_on': '2019-11-25T05:31:27.283Z',
          'created_by': 'Admin',
          'modified_on': '2019-11-25T05:31:27.283Z',
          'modified_by': 'Admin',
          'id': 2,
          'enable_settings': '1',
          'is_resizable': true,
          'is_movable': true,
          'is_minimizable': true,
          'is_maximizable': true,
          'is_closable': true,
          'refresh_interval_sec': 0,
          'version': 0
        }
      },
      {
        'created_on': '2019-11-25T05:31:10.390Z',
        'created_by': 'Admin',
        'modified_on': '2019-11-25T05:31:10.390Z',
        'imageUrl': 'assets/osirevenue.png',
        'title': 'Average Weekly Billable Hours',
        'id': 4,
        'type': 'listingWidget',
        'name': 'BillableHours',
        'status': true,
        'is_visible': true,
        'version': 0,
        'seq_num': 2,
        'is_employee': true,
        'widget_setting': {
          'created_on': '2019-11-25T05:31:27.283Z',
          'created_by': 'Admin',
          'modified_on': '2019-11-25T05:31:27.283Z',
          'modified_by': 'Admin',
          'id': 2,
          'enable_settings': '1',
          'is_resizable': true,
          'is_movable': true,
          'is_minimizable': true,
          'is_maximizable': true,
          'is_closable': true,
          'refresh_interval_sec': 0,
          'version': 0
        }
      }
    ];
  }

}
