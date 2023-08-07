import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import { CONFIGURATION } from '../app.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IExpenseTypes } from '../utilities/expenseTypes.model';
import { IProjects } from '../utilities/projectsData.model';
import { ITasks } from '../utilities/tasksData.model';
import { ICurrencies } from '../utilities/curenciesData.model';
import { ICurrencyExchangeDetails } from '../utilities/currencyExchangeDetails.model';
import { AppConstants } from '../../shared/app-constants';
import { HttpUtilities } from '../../shared/utilities/';
import { servicesVersion } from 'typescript';

@Injectable()
export class CreateExpenseService {

    private appData = AppConstants;
    private createServiceCtx: string = "createexpense/";
    data;

    constructor(private httpUtilities: HttpUtilities, private http: HttpClient) { }

    getDefaultCurrentWeekStart(): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'getDefaultCurrentWeekStart')
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getMinMaxDatesByStartDt(startDt: string): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'getMinMaxDatesByStartDt?startDt=' + startDt)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getExpensesTypes(projectId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'getExpenseTypes?projectId=' + projectId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getProjectsData(weekDate): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'getAllProjects/' + weekDate)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getTasksData(projectId, expenseWeekStartDate, expenseWeekEndDate): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'getProjectTasks?projectId=' + projectId
            + '&expenseWeekStartDate=' + expenseWeekStartDate + '&expenseWeekEndDate=' + expenseWeekEndDate)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getCurrenciesData(): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'getCurrencies')
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    populateCurrencyExchangeDetails(currencyCode, qty, receiptPrice, expenseDate, projectId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'getCurrencyExchangeDetails?currencyCode=' + currencyCode
            + '&qty=' + qty + '&receiptPrice=' + receiptPrice + '&expenseDate=' + expenseDate + '&projectId=' + projectId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    saveExpense(user): Observable<any> {
        return this.httpUtilities.post(this.appData.appUrl + this.createServiceCtx + "savenewexpense", user)
            .map((response: any) => {
                return response;
            });
    }

    submitExpense(user): Observable<any> {

        return this.httpUtilities.post(this.appData.appUrl + this.createServiceCtx + "submitnewexpense", user)
            .map((response: any) => {
                return response;
            });
    }


    getMileageRate(orgId, expenseDate, expenseTypeId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'managerapproveexpenses/getMileageAmt/' + orgId + '/' + expenseDate + '?sourceType=' + this.appData.accountServices + '&sourceId=' + expenseTypeId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    checkReportExistOrNot(selectedDate): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.createServiceCtx + 'checkExpenseExistOrNotForDateRange?selectedDate=' + selectedDate)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        /// console.error("error========",error);
        return Observable.throw(error || 'Failed in web api(Server error) ');
    }

    //upload
    upLoadFile(formData: FormData): Observable<HttpEvent<{}>> {
        /*
        return this.httpUtilities.post(this.appData.appUrl+'osiattachments/save/expensesRPT/v1/expenses/expenses/attachment'
            ,formData) .map((response: any) => {
            return response;
        });
        */
        //    let options = new RequestOptionsArgs();

        //    options.headers = new Headers();

        //    options.headers.append('Content-Type', 'multipart/form-data');

        const req = new HttpRequest('POST', this.appData.appUrl + 'attachmentservice/uploadFile', formData,
            {
                //headers:  new  HttpHeaders().set('Content-Type',  'multipart/form-data')

            });

        return this.http.request(req);
    }

    downloadFile(duplicateFileName: string, expenseId: string): Observable<any> {

        return this.httpUtilities.get(this.appData.appUrl + this.createServiceCtx + "downloadfile/" + duplicateFileName + "/" + expenseId)
            .map((response: any) => response)
            .catch(this.handleError);
    }

    getLogoImage(): Observable<any> {
        return this.http.get(this.appData.uiUrl + this.appData.a5ContextPath + "/assets/images/osi_digital.png", { responseType: 'blob' });
        // return this.http.get(this.appData.uiUrl+this.appData.a7ContextPath+"/assets/images/osi_digital.png", { responseType: 'blob' });
    }

    getEmployeeDetails(employeeId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + "v1/employees/details/" + employeeId)
            .map((response: any) => response)
            .catch(this.handleError);
    }

    downloadAllAttachments(expenseReportIdList): Observable<any> {
        return this.httpUtilities.post(this.appData.appUrl + this.createServiceCtx + "allAttachemnts", expenseReportIdList)
            .map((response: any) => response)
            .catch(this.handleError);
    }

    uploadExpense(reportId, data): Observable<any> {
        let headers = new HttpHeaders();

        headers = headers.set("Auth_Token", localStorage.getItem('token'))
            .set("Proxy_User_Id", localStorage.getItem('proxyUserId'));
        return this.http.post(this.appData.appUrl + "attachmentservice/uploadReceipts?expenseReportId=" + reportId, data, { headers: headers, reportProgress: true, observe: 'events' });
    }

    deleteAttachment(attachmentId) {
        return this.httpUtilities.put(this.appData.appUrl + "attachmentservice/softDeleteAttachment?attachmentId=" + attachmentId)
            .map((response: any) => response)
            .catch(this.handleError);
    }

}