import { Injectable } from "@angular/core";
import {
  Http,
  Response,
  ResponseContentType,
  RequestOptions,
  Headers
} from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { saveAs } from "file-saver";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { AppConstants } from "../shared/app-constants";
import { HttpUtilities } from "../shared/utilities";
import { ViewReport } from "../report/viewreport";


@Injectable()
export class ReportService {
  @BlockUI() blockUI: NgBlockUI;
  constructor(private _http: HttpUtilities, private http: Http) {}
  private appData = AppConstants;
  getActiveReports(): Observable<any[]> {
    return this._http
      .get(AppConstants.reportUrl + "active-reports")
      .map((response: any[]) => response);
  }
  getAvailableAndFilterColumns(prtMetaDataId): Observable<any> {
    return this._http
      .get(AppConstants.reportUrl + "available-filter-columns/" + prtMetaDataId)
      .map((response: any[]) => response);
  }
  getFilterValues(
    viewName,
    columnName,
    columnDataType,
    allOrEmployee
  ): Observable<any[]> {
    return this._http
      .get(
        AppConstants.reportUrl +
          "filter-column-values/" +
          viewName +
          "/" +
          columnName +
          "/" +
          columnDataType +
          "/" +
          allOrEmployee
      )
      .map((response: any[]) => response);
  }
  runReport(reportsDTO, fileType): Observable<any[]> {
    return this._http
      .post(AppConstants.reportUrl + "run-report/type/" + fileType, reportsDTO)
      .map((response: any[]) => response)
      .catch(this.handleError);
  }
  reportReRun(savedRptId, viewName, fileType): Observable<any[]> {
    return this._http
      .get(
        AppConstants.reportUrl + "report-re-run/" + savedRptId + "/" + viewName + "/reportType/" + fileType
      )
      .map((response: any[]) => response)
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    console.log(error);
    if (error.status === 0) {
      return Observable.throw(
        "Problem with server Please contact Administrator"
      );
    } else {
      return Observable.throw(
        error.json().message || "Please contact Administrator"
      );
    }
  }

  downloadFile(reportsDTO): Observable<Blob> {
    let options = new RequestOptions({
      responseType: ResponseContentType.Blob
    });
    return this.http
      .post(this.appData.reportUrl + "run-pdf-report", options, reportsDTO)
      .map(res => res.blob())
      .catch(this.handleError);
  }

  ///
  getAllSavedReports(rptName, sharedBy): Observable<any[]> {
    return this._http
      .get(AppConstants.reportUrl + "saved-reports?rptName="+rptName+"&&sharedBy="+sharedBy)
      .map((response: any[]) => response);
  }

  getSavedReport(viewName, rptMetaDataId): Observable<any[]> {
    return this._http
      .get(
        AppConstants.reportUrl +
          "get-saved-report/" +
          viewName +
          "/" +
          rptMetaDataId
      )
      .map((response: any[]) => response);
  }

  deleteSavedReport(rptMetaDataId): Observable<any[]> {
    return this._http
      .get(AppConstants.reportUrl + "delete-saved-report/" + rptMetaDataId)
      .map((response: any[]) => response);
  }


  shareReport(sendData): Observable<any[]> {
    return this._http
      .post(AppConstants.reportUrl + "save-shared-report", sendData)
      .map((response: any[]) => response);
  }

  getMailSuggestion(mail): Observable<any> {
    return this._http
      .post(this.appData.appUrl + "assignments/searchEmployeeByEmpName/" + mail)
      .map((response: any) => {
        return response;
      });
  }

  getReportPdf(pdfUrl: string): Observable<any> {

    const options = new RequestOptions({
      responseType: ResponseContentType.Blob
    });

    return this.http
      .get(pdfUrl, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }
}
