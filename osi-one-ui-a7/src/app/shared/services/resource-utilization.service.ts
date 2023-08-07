import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpUtilities } from '../utilities';
import { AppConstants } from '../app-constants';

@Injectable()
export class ResourceUtilizationService {
  revenueFiltersdata: any;

  constructor(private httpUtilities: HttpUtilities) { }

  getEmployeeGrade(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + 'assignments/getEmployeeGrade')
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getResourcesList(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + 'resourceUtilization')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getByProjectsList(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + 'projectResourceUtilization')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError)
  }

  getOSIProjectInvoicesData(): Observable<any> {
    return this.httpUtilities.get(AppConstants.reportUrl + 'sales-person-dashboard')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getosiSalesAgeingReportData(): Observable<any> {
    return this.httpUtilities.get(AppConstants.reportUrl + 'sales-age-dashboard')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }


  getosiSalesPersonDashboardData(id): Observable<any> {
    return this.httpUtilities.get(AppConstants.reportUrl + 'project-inovices-by-project?projectId=' + id)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getAccountManagerDashboardData(): Observable<any> {
    return this.httpUtilities.get(AppConstants.reportUrl + 'account-manager-dashboard')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyResources(): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'reports/myresources/getMyCurrentResources')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyContractors(): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'reports/myresources/getMyCurrentContractors')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyInterOrgResources(): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'reports/myresources/getMyCurrentInterns')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyProjects(): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'reports/project/getMyCurrentProjects')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getFiltersDataWithCustomer(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + 'revenueFilters')
      .map((response: any) => this.revenueFiltersdata = response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getResourceOrganizations(): Observable<any> {
    return this.httpUtilities.get(AppConstants.dashboardUrl + 'filters/myresources/getOrgs')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getResourceEmployees(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + 'filter/resource/revenue/getAllEmp')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getClientsByOrgID(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/myresources/getClients', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectsByCustID(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/myresources/getProjects', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getPracticeByProjectID(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/myresources/getPractices', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getSubPracticeByProjectID(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/myresources/getSubPractices', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getEmployeesByProjectID(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/myresources/getEmployees', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectOrganizations(): Observable<any> {
    return this.httpUtilities.get(AppConstants.dashboardUrl + 'filters/project/getOrgs')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getRegionDataForProjects(filter): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/project/getRegions', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getPracticesDataFromProjects(filter): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/project/getPractices', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getSubPracticesDataFromProjects(filter): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/project/getSubPractices', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getClientDataFromProjects(filter): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/project/getClients', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectDataFromProjects(filter): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + 'filters/project/getProjects', filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  /* Takes columns and filters and returns json data that can be used to export to excel file */
  getExportToExcelData(payLoad: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.appUrl + `export/excel`, payLoad)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }
  
  getInvoiceCustomerData(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.appUrl + `filter/project/invoice/getClients`, filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getInvoiceProjectData(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.appUrl + `filter/project/invoice/getProjects`, filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getInvoiceData(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + `reports/project/getProjectInvoices`, filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectDataByCustID(id: any): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + `filter/resource/utilization/getPractices` + id)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getUtilPract(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + `filter/resource/utilization/getPractices`)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getUtilSubPract(id: any): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + `filter/resource/utilization/getSubPractices?pracId=${id}`)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getUtilEmployee(prac: any, subPrac: any): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + `filter/resource/utilization/getAllEmp?prac=${prac}&subPrac=${subPrac}`)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getResourceUtilization(filter: any): Observable<any> {
    return this.httpUtilities.post(AppConstants.dashboardUrl + `reports/myresources/getMyResourceUtilization`, filter)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getYears(): Observable<any> {
    return this.httpUtilities.get(AppConstants.appUrl + 'filter/common/getYears')
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getResourceEmployeesByOrgs(payload: object): Observable<any> {
    return this.httpUtilities.post(
      AppConstants.appUrl + 'filter/resource/getEmpoyees',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getResourceCount(payload: object): Observable<any> {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getMyResource',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyResourceRevenueSources(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getMyResourceRevenueSources',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getExcelDataForProjectInvoices(payload: any) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/project/getExcelDataForProjectInvoices',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getExcelDataForMyResources(payload: any) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getExcelDataForMyResources',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectRevenueDistribution(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/project/getProjectRevenueDistribution',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyResourceRevenue(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getMyResourceRevenue',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getExcelDataForMyResourceRevenue(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getExcelDataForMyResourceRevenue',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getExcelDataForProjectRevenue(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/project/getExcelDataForProjectRevenue',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }



  getProjectRevenue(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/project/getProjectRevenue',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyFutureRevenue(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getMyFutureRevenue',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyFutureRevenueExport(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getExcelDataForFutureRevenue',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getSalesReport(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/sales/getSalesReport',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getSalesAgingReport(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/sales/getSalesAgeingReport',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getMyResourceExpenses(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getMyResourceExpenses',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getExcelDataForMyResourceExpenses(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/myresources/getExcelDataForMyResourceExpenses',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectExpenses(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/project/getProjectExpenses',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getExcelDataForProjectExpenses(payload: object) {
    return this.httpUtilities.post(
      AppConstants.dashboardUrl + 'reports/project/getExcelDataForProjectExpenses',
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectInvoices(id: any): Observable<any> {
    return this.httpUtilities.get(AppConstants.dashboardUrl + `reports/sales/getSalesProjectInvoices?projectId=${id}`)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getAllProjects(): Observable<any> {
    return this.httpUtilities.get(`${AppConstants.dashboardUrl}filters/project/getAllProjects`)
      .map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getProjectEstimatedVsActualData(payload: any) {
    return this.httpUtilities.post(
      `${AppConstants.dashboardUrl}reports/project/getEstimatedVsActualData`,
      payload
    ).map((response: any) => response)
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error("error========", error);
    return Observable.throw(error || 'Failed in web api(Server error) ');
  }

  setRevenueFilterData(filterData: any) {
    this.revenueFiltersdata = filterData;
  }

  getRevenueFilterData() {
    return this.revenueFiltersdata;
  }

}
