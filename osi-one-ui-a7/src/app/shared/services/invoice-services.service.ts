import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
//import { CONFIGURATION } from '../app.config';
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { HttpUtilities } from "../utilities";
import { AppConstants } from "../app-constants";

@Injectable()
export class InvoiceServices {
  private appData = AppConstants;
  private invoiceTemplateCtx: string = "invoiceTemplate/";
  constructor(private httpUtilities: HttpUtilities) { }

  getInvoiceGroupingColumns(): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.invoiceUrl +
        this.invoiceTemplateCtx +
        "getInvoiceGroupingColumns"
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getInvoiceColumns(): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.invoiceUrl + this.invoiceTemplateCtx + "getInvoiceColumns"
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }
  invoiceLayoutNameAvailability(invoiceLayoutName): Observable<any> {
    return this.httpUtilities
      .get(
        this.appData.invoiceUrl + this.invoiceTemplateCtx + "verifyInvoiceLayoutName/" + invoiceLayoutName
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getOrgAddress() {
    return this.httpUtilities
      .get(
        this.appData.invoiceUrl + this.invoiceTemplateCtx + "getOrganizationAddresses"
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getInvoiceDetailById(invoiceId) {
    console.log(invoiceId.valueOf());
    return this.httpUtilities
      .get(
        this.appData.invoiceUrl + this.invoiceTemplateCtx + "getInvoiceLayoutDetails/" + invoiceId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getProjectsByManagerId(managerId) {
    console.log(managerId);
    return this.httpUtilities
      .get(
        this.appData.invoiceUrl + 'api/pmAcivity/getProjectsByManagerId/' + managerId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  deleteAttachment(osiattachmentsdto) {

    return this.httpUtilities
    .post(this.appData.invoiceUrl + 'api/' + 'osiattachments/delete', osiattachmentsdto)
    .map((response: any) => response)
    .catch(this.handleError);
  }

  getAllAttachments(objectType,projectId) {
      return this.httpUtilities
      .get(
        this.appData.invoiceUrl + 'api/' + 'osiattachments/findAll/' + objectType + '/' + projectId
      )
      .map((response: any) => response)
      .catch(this.handleError);
  }

  viewAllAttachments(projects,projectId) {
    return this.httpUtilities
      .get(this.appData.invoiceUrl + 'api/osiattachments/findAll/' +  projects + '/' + projectId)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  createNewDynamicInvoice(body) {
    return this.httpUtilities
      .post(this.appData.invoiceUrl + this.invoiceTemplateCtx + "createInvoiceLayout", body)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  editOldInvoice(body) {
    return this.httpUtilities
      .post(this.appData.invoiceUrl + this.invoiceTemplateCtx + "updateInvoiceLayout", body)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  deleteInvoiceLayout(invoiceId) {
    return this.httpUtilities
      .get(this.appData.invoiceUrl + this.invoiceTemplateCtx + "deleteInvoiceLayout/" + invoiceId)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  listOfInvoiceTemplate() {
    return this.httpUtilities
      .get(this.appData.invoiceUrl + this.invoiceTemplateCtx + "getInvoiceLayoutList")
      .map((response: any) => response)
      .catch(this.handleError);
  }

  viewInvoice(body: any, limitCount: any) {
    return this.httpUtilities
      .post(this.appData.invoiceUrl + 'invoice/searchInvoiceSummaryDetails?limitCount=' + limitCount, body)
      .map((response: any) => response)
      .catch(this.handleError);
  }

 
  getInvoiceDetails(body: any) {
    return this.httpUtilities
      .post(this.appData.invoiceUrl + 'invoice/searchInvoiceSummaryDetails', body)
      .map((response: any) => response)
      .catch(this.handleError);
  }


  getAllCustomersForService(): Observable<any> {
    let url = 'invoice/getAllCustomers';
    return this.httpUtilities.get(AppConstants.invoiceUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getLookupbyName(lookupName: any): Observable<any> {
    let url = 'config/statusCodes/' + lookupName;
    return this.httpUtilities.get(AppConstants.appUrl + url)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectByOrgCust(body: any) {
    return this.httpUtilities
      .post(this.appData.appUrl + "project/findOsiProjectsByOrganization", body)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getTotalInvSummary(body: any) {
    return this.httpUtilities
      .post(this.appData.invoiceUrl + "invoice/invoiceTotalSummary", body)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getPaymentHistory(body: any) {
    return this.httpUtilities
      .post(this.appData.invoiceUrl + "invoice/getInvoicePayments", body)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  saveSoftexNumber(body: any): any {
    return this.httpUtilities
      .post(this.appData.invoiceUrl + "invoice/saveSoftexNumber", body)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  savePaymentHistory(body: any): any {
    return this.httpUtilities
      .post(this.appData.invoiceUrl + `invoice/savePaymentHistoryWithFircNumber`, body)
      .map((response: any) => response)
      .catch(this.handleError);
  }


  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error("error========" + error);
    return Observable.throw(
      error.json().error || "Failed in web api(Server error) "
    );
  }
}
