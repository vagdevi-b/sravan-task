import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IExpenseDetails } from '../utilities/expenseDetails';
import { HttpUtilities } from '../utilities';
import { AppConstants } from '../app-constants';

@Injectable()
export class EditExpensesService {

    private appData = AppConstants;
    private editServiceCtx: string = "editexpenses/";

    constructor(private httpUtilities: HttpUtilities) { }

    getMaxExpenseId(): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + this.editServiceCtx + 'getMaxExpenseId')
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getAllExpensesForReportId(reportId: string, status: string): Observable<any> {
        console.log(" : " + reportId);
        return this.httpUtilities.get(this.appData.appUrl + this.editServiceCtx + 'getExpensesById?expenseReportId=' + reportId + '&status=' + status)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getAllReimbursedExpenses(reportId:  string,  status:  string):  Observable<any> {
        return  this.httpUtilities.get(this.appData.appUrl  +  this.editServiceCtx  +  'getReimbursedExpenses?expenseReportId='  +  reportId  +  '&status='  +  status)
            .map((response:  any)  =>  response)
            .do(data  =>  JSON.stringify(data))
            .catch(this.handleError);
    }

    removeExpense(user): Observable<any> {
        //console.log(" : "+selectedRow);
        return this.httpUtilities.post(this.appData.appUrl + this.editServiceCtx + 'removeExpense', user)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    updateExpense(user): Observable<any> {
        return this.httpUtilities.put(this.appData.appUrl + this.editServiceCtx + "updateexpense", user)
            .map((response: any) => {
                return response;
            });
    }

    saveExpense(user): Observable<any> {
        return this.httpUtilities.post(this.appData.appUrl + this.editServiceCtx + "saveexpense", user)
            .map((response: any) => {
                return response;
            });
    }

    saveQbExpense(id,date): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl +"pmoexpenses/saveQBExpenseReportDate?expenseReportId=" + id+ "&qbExpenseReportDate=" +date)
            .map((response: any) => {
                return response;
            });
    }
    
    getAllNonReimbursedExpensesForReportId(reportId: string): Observable<any> {
        console.log(" : " + reportId);
        return this.httpUtilities.get(this.appData.appUrl + this.editServiceCtx + 'getNonReimbursedExpenses?expenseReportId=' + reportId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    pmoRejectExpenses(expenses): Observable<any> {
        console.log(" : " + expenses);
        return this.httpUtilities.post(this.appData.appUrl + this.editServiceCtx + 'pmoRejectExpenses', expenses)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    getExpenseForApproval(auditDTO): Observable<any> {
        return this.httpUtilities.post(this.appData.invoiceUrl + 'auditLogs/getExpenseWaitingForApproval', auditDTO)
        .map((response: any) => response)
        .do(data => JSON.stringify(data))
        .catch(this.handleError);
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error("error========" + error);
        return Observable.throw(error.json().error || 'Failed in web api(Server error) ');
    }

    updatePmoExpense(user): Observable<any> {
        return this.httpUtilities.put(this.appData.appUrl + "pmoexpenses/updateexpense", user)
            .map((response: any) => {
                return response;
            });
    }

    approvePmoExpense(user):Observable<any>{
        return this.httpUtilities.put(this.appData.appUrl + "pmoexpenses/approveExpenses", user)
            .map((response: any) => {
                return response;
            });
    }

    rejectPmoExpense(user):Observable<any>{
        return this.httpUtilities.put(this.appData.appUrl + "pmoexpenses/rejectExpenses", user)
            .map((response: any) => {
                return response;
            });
    }

    getProjectsDataByEmployeeId(weekDate, employeeId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'pmoexpenses/getAllProjects/'+weekDate+'/'+employeeId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getTasksData(projectId, employeeId, expenseWeekStartDate, expenseWeekEndDate): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'pmoexpenses/getProjectTasks?projectId=' + projectId+'&employeeId='+employeeId+'&expenseWeekStartDate='+expenseWeekStartDate+'&expenseWeekEndDate='+expenseWeekEndDate)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getExpensesTypes(projectId, employeeId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'pmoexpenses/getExpenseTypes?projectId=' + projectId+'&employeeId='+employeeId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    
    pmoRemoveExpenseLine(user): Observable<any> {
        //console.log(" : "+selectedRow);
        return this.httpUtilities.post(this.appData.appUrl + 'pmoexpenses/removeExpenseLine', user)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    pmoRemoveExpense(user): Observable<any> {
        //console.log(" : "+selectedRow);
        return this.httpUtilities.post(this.appData.appUrl + 'pmoexpenses/removeExpense', user)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getExpenseReportBasedOnReportId(expenseReportId): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'pmoexpenses/getExpensesBasedOnReportId?reportId='+expenseReportId)
        .map((response: any) => response)
        .do(data => JSON.stringify(data))
        .catch(this.handleError);
    }

    getAllExpensesForPmoReportId(reportId: string, status: string, employeeId: string): Observable<any> {
        console.log(" : " + reportId);
        return this.httpUtilities.get(this.appData.appUrl + 'pmoexpenses/getExpensesById?expenseReportId=' + reportId + '&status=' + status + '&employeeId=' + employeeId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    populatePmoCurrencyExchangeDetails(currencyCode, qty, receiptPrice, expenseDate, projectId, employeeId: string): Observable<any> {
        return this.httpUtilities.get(this.appData.appUrl + 'pmoexpenses/getCurrencyExchangeDetails?currencyCode=' + currencyCode
            + '&qty=' + qty + '&receiptPrice=' + receiptPrice + '&expenseDate=' + expenseDate + '&projectId=' + projectId + '&employeeId=' + employeeId)
            .map((response: any) => response)
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    approvePmoExpenseFromReportPage(expenseIdList):Observable<any>{
        return this.httpUtilities.post(this.appData.appUrl + "pmoexpenses/approveFromReportPage",expenseIdList)
            .map((response: any) => {
                return response;
            });
    }

    getExpenseAttachmentsByReport(reportId):Observable<any>{
        return this.httpUtilities.get(this.appData.appUrl+'attachmentservice/attachmentsByExpenseReport?expenseReportId='+reportId)
        .map((response:any)=>response)
        .catch(this.handleError);

    }
}