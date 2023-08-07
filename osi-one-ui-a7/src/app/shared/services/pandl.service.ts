import { Injectable } from '@angular/core';
import { AppConstants } from '../app-constants';
import { HttpUtilities } from '../utilities';
import { Observable, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { saveAs } from 'file-saver';
import * as _ from 'lodash';
import { IdbService } from './idb.service';

@Injectable({
  providedIn: 'root'
})
export class PandlService {
  private appData = AppConstants;
  pAndLRoutes: any[] = ['/reports/PAndL', '/pandldata', '/pandldetail', '/pandlproject', '/pandlutilization', '/pandlemployee', '/pandlcustomerview', '/pandldetail1','/pandldetail2'];
  runPandLData$ = new BehaviorSubject<any>(null);
  runPandLDataProjects$ = new BehaviorSubject<any>(null);
  runPaymentData$ = new BehaviorSubject<any>(null);
  runPandLDataTriggered$ = new BehaviorSubject<Boolean>(false);
  runPandLDataTriggeredProjects$=new BehaviorSubject<Boolean>(false);
  runPaymentDataTriggered$ = new BehaviorSubject<Boolean>(false);
  subscription: Subscription[] = [];
  constructor(private httpUtilities: HttpUtilities,
    private idbService: IdbService) { }

  getSowList(projectId): Observable<any> {
    let url = `${this.appData.appUrl}invrecognition/get-sow-details/${projectId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      })
  }

  getYearsList(): Observable<any> {
    let url = `${this.appData.invoiceUrl}dashboard/filters/project/getYears`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      })
  }

  getPanelData(body): Observable<any> {
    let url = `${this.appData.invoiceUrl}dashboard/reports/project/getPanelData?`;
    return this.httpUtilities.post(url, body)
      .map((response: any) => {
        return response;
      })
  }

  getRunPandLData(body): Observable<any> {
    this.runPandLDataTriggered$.next(true);
    this.runPandLDataTriggeredProjects$.next(true);
    let url = `${this.appData.invoiceUrl}dashboard/reports/project/runPAndLPanelData`;
    return this.httpUtilities.post(url, body)
      .map((response: any) => {
        this.runPandLData$.next(response);
        return response;
      })
  }

  getRunPandLDataTriggered(): Observable<any> {
    return this.runPandLDataTriggered$.asObservable();
  }

  getDataofPandL(): Observable<any> {
    return this.runPandLData$.asObservable();
  }
  getRunPandLDataProjects(body): Observable<any> {
    this.runPandLDataTriggeredProjects$.next(true);
    let url = `${this.appData.invoiceUrl}dashboard/reports/project/runPAndLPanelData`;
    return this.httpUtilities.post(url, body)
      .map((response: any) => {
        this.runPandLDataProjects$.next(response);
        return response;
      })
  }
  getRunPandLDataProjectsTriggered(): Observable<any> {
    return this.runPandLDataTriggeredProjects$.asObservable();
  }

  getDataofPandLProjects(): Observable<any> {
    return this.runPandLDataProjects$.asObservable();
  }
  PaymentSummary(body):Observable<any>{
    this.runPaymentDataTriggered$.next(true);
    let url = `${this.appData.invoiceUrl}dashboard/reports/project/getInvoicedVsPayments`;
    return this.httpUtilities.post(url, body)
    .map((response: any) => {
      this.runPaymentData$.next(response);
      return response;
    })
  }
  getRunPaymentDataTriggered(): Observable<any> {
    return this.runPaymentDataTriggered$.asObservable();
  }

  getDataofPayment(): Observable<any> {
    return this.runPaymentData$.asObservable();
  }
  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    saveAs(data, fileName);
  }
  public exportToCsv(rows: object[], fileName: string): string {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
    this.saveAsFile(csvContent, `${fileName}.csv`, 'text/csv');
  }

  getUniqueDataAfterFilter(data, keyword) {
    let newArray = [];
    newArray = _.uniqBy(data, keyword);
    let uniqueArray = newArray.sort(this.GetSortOrder(keyword));
    // let filtered = uniqueArray.filter(item => item[keyword] != null);
    return uniqueArray;
  }

  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }


  filterArray(array, filters) {
    // console.log(filters,'filters');
    const filterKeys = Object.keys(filters);
    return array.filter(eachObj => {
      return filterKeys.every(eachKey => {
        if (!filters[eachKey].length) {
          return true; // passing an empty filter means that filter is ignored.
        }
        return filters[eachKey].includes(eachObj[eachKey]);
      });
    });
  }

  generateColumns(data: any[]) {
    let columnDefinitions = [];

    data.map(object => {
      Object.keys(object).map(key => {
        let mappedColumn = {}
        if (key === 'employee') {
          mappedColumn = {
            headerName: key.toUpperCase(),
            field: key
          }
        } else {
          const tokenizedKeys: any[] = key.includes('hours') || key.includes('revenue') ? key.split('-') : [];
          mappedColumn = {
            headerName: tokenizedKeys.length ? tokenizedKeys[0].toUpperCase() : key.toUpperCase(),
            field: tokenizedKeys.length ? tokenizedKeys[0] : key,
            sortable: true
          }
        }
        columnDefinitions.push(mappedColumn);
      })
    })
    //Remove duplicate columns
    columnDefinitions = columnDefinitions.filter((column, index, self) =>
      index === self.findIndex((colAtIndex) => (
        colAtIndex.field === column.field
      ))
    )
    let sortedColumns = columnDefinitions.sort(this.GetSortOrder('field'));
    return sortedColumns.reverse();
  }


  roundTo(num: number, places: number) {
    let factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }

  calcHeight(numOfBars, widgetId) {
    var maxHeightOfChart = 250;
    var minHeight = 20; //setting the min height of the bar + margin between
    var chartHeight = minHeight * numOfBars > maxHeightOfChart ? minHeight * numOfBars : maxHeightOfChart;
    document.getElementById("canvasContainer" + widgetId).style.height = chartHeight.toString() + "px";
  }

  localeStringToNumber(numStr) {
    let num = numStr.replace(/\D/g, '');
    //1000000  (string)

    let num2 = parseInt(num);
    //1000000  (numeric)
    return num2;
  }

}
