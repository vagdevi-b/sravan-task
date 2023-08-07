/**

* App Constants

*/

import { environment } from "../../environments/environment";
export class AppConstants {



  // public static imageUrl = 'http://192.168.32.63:8080/EMS-DATA/EMPLOYEE/';
  public static imageUrl = `${environment.reportsDownloadBaseUrl}/EMPLOYEE/`;



  // public static appUrl = 'http://192.168.32.63:8080/tsm-api/api/';

  public static appUrl = `${environment.tsmBaseUrl}/api/`;


  // public static emsAppUrl = 'http://192.168.32.63:8080/ems-api/api/';
  public static emsAppUrl = `${environment.emsBaseUrl}/api/`;



  // public static exmsAppUrl = 'http://192.168.32.63:8080/exms-api/api/';
  public static exmsAppUrl = `${environment.exmsBaseUrl}/api/`;


  // public static reportUrl = 'http://192.168.32.63:8080/reports/';
  public static reportUrl = `${environment.reportUrl}/`;


  // public static dashboardUrl = 'http://192.168.32.63:8080/tsm-api/dashboard/';
  public static dashboardUrl = `${environment.tsmBaseUrl}/dashboard/`;


  // public static invoiceUrl = 'http://192.168.32.63:8080/tsm-api/';
  public static invoiceUrl = `${environment.tsmBaseUrl}/`;

  // public static uiUrl = 'http://localhost:8080/';
  public static uiUrl = `${environment.uiUrl}/`;

  // public static reportsDownloadURL = 'http://192.168.32.63:8080/EMS-DATA/REPORTS/';
  public static reportsDownloadURL = `${environment.reportsDownloadBaseUrl}/REPORTS/`;

  // public static elasticSearchURL = 'http://192.168.32.63:9200';
  public static elasticSearchURL = `${environment.elasticSearchUrl}`;


  // public static imageurl = 'http://192.168.32.63:8080/EMS-DATA/';
  public static imageurl = `${environment.reportsDownloadBaseUrl}/`;


  // public static iRecruitUrl = 'http://192.168.32.63:8080/';
  public static iRecruitUrl = `${environment.recruitmentBaseUrl}/`;


  // public static resignationUrl = 'http://192.168.32.63:8080/resignation/v1/api/';
  public static resignationUrl = `${environment.resignationBaseUrl}/v1/api/`;


  // public static resignationDownloadFile = 'http://192.168.32.63:8080/EMS-DATA';
  public static resignationDownloadFile = `${environment.reportsDownloadBaseUrl}`;

  // public static profileDownloadUrl = 'http://192.168.32.63:8080/EMS-DATA/RECRUIT/';
  public static profileDownloadUrl = `${environment.reportsDownloadBaseUrl}/RECRUIT/`;

  public static a1ContextPath = 'a1';

  public static a5ContextPath = 'a7';


  // public static cookieDomain = 'localhost';

  public static cookieDomain = `${environment.cookieUrl}`;



  public static contentType = 'Content-type';

  public static JSONContentType = 'application/json';



  public static getProjectResources = 'timeSheets/getProjectResources';

  public static getWeeklyStatus = 'timeSheets/getWeeklyStatus';

  public static getApprovalTimesheets = 'timeSheets/getApprovalTimesheets';

  public static customerImageType = ['image/jpg', 'image/jpeg', 'image/png'];



  // ag-grid constants

  public static agGridClass: string = 'ag-theme-balham';

  public static domLayout: string = 'autoHeight';

  public static paginationPageSize: number = 10;

  public static usMileageExpensePrice = 0.585;

  public static usMileageExpensePrice_old = 0.405;

  public static usMileageExpensePrice_wef = '2022-06-01';

  public static accountServices = 'osi_account_services';

  public static messageTimerName = 'messageTimerName';

  public static messageAutoHideSec = 50;

  public static successMessageType = 'success';

  public static errorMessageType = 'error';

  public static warningMessageType = 'warning';

  public static errorResponseCheck = 'Error!';

  public static warningResponseCheck = 'Warning!';

  public static defaultErrorMessage = 'Please contact Administrator';

  public static createFilterSucessMessage = 'Filter created sucessfully.';

  public static dummyRequestErrorMessage = 'error';

  public static emptyString = '';

  public static fileNameToSave = 'REPORT-';

  public static DefaultFileFormatToSave = '.pdf';

  public static fileDownloadContentType = 'text/csv';

  public static fileDownloadSucessMessage = 'Data download complete.';

  public static invalidCredentialsErrorMessage = 'Invalid Credentials';

  public static authenticationProblemErrorMessage = 'Problem while authentication Please contact Administrator';

  public static logoutErrorMessage = 'Problem while logout';

  public static serverErrorMessage = 'Problem with server Please contact Administrator';

  public static downloadUrl = 'downloadPdf';

  public static downloadExcelUrl = 'downloadExcel';

  public static fileTypeDownloadFormField = 'fileType';

  public static fileDownloadErrorMessage = 'Problem while downloading Please contact Administrator';

  public static duplicateColumnDisplayName = 'This Display Column Name allready exist';

  public static reportDeleteSuccessmsg = 'Report Deleted sucessfully.';

  public static reportDeleteFailuremsg = 'Problem Occured while Deleting';

  public static applyFilterSucessMessage = 'Filter applied sucessfully.';



  public static expenseAttachmentTypes = ['image/jpg', 'image/jpeg', 'image/png',

    'application/pdf', 'application/xls', 'application/vnd.ms-excel', 'application/msword',

    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  // public static expenseAttachmentURL = AppConstants.uiUrl + 'EMS-DATA/';

  public static expenseAttachmentURL = `${environment.expenseAttachmentUrl}`;

  // public static dashboardImages = AppConstants.uiUrl + 'EMS-DATA/DASHBOARD_IMAGES/';
  public static dashboardImages = `${environment.dashBoardImages}`;


  // public static wsrPDF = AppConstants.uiUrl + 'EMS-DATA/WSR/';
  public static wsrPDF = `${environment.wrsPdfUrl}`;


  public static OsiUsOrgCode = "OSIUS";

  public static OsiCanOrgCode = "OSICAN";



  public static STATUS_CODE_LIST = {

    'RM_INITIATED': 'DRAFT',

    'PM_DRAFT': 'PM DRAFT',

    'RATING_INITIATED': 'RATING INITIATED',

    'INITIATED': 'INITIATED',

    'EMP_ACCEPTED': 'EMP ACCEPTED',

    'EMP_REVIEWED': 'EMP REVIEWED',

    'RM_REVIEWED': 'RM REVIEWED',

    'CLOSED': 'CLOSED',

    'EMP_INITIATED': 'EMP INITIATED',



  };



  public static a5NavigationURLs = ['/invoice/listOfDynamicInvoiceTemplate',

    '/deptmapping', '/leaves/leavehistory', '/reports/allReports', '/reports/runReports',

    '/reports/savedReports', '/reports/Invoices', '/reports/Leaves', '/reports/Employee',

    '/reports/PAndL', '/expenses/view-expenses', '/expenses/manager-expense',

    '/leaves/viewleaves', '/leaves/approve-leave', '/holidays', '/projects',

    '/reports/Project', '/leaves/viewleaveaccurals', '/expenses/expense-payment',

    '/expenses/pmo-expenses', '/pmo-verifications/missingExchangeRates',

    '/invoice/undeliveredInvoices', '/timesheets/timesheetMove', '/rm-dashboard',

    '/sales-dashboard', '/pm-dashboard', '/accounts-dashboard', '/reviewcycle/list',

    '/reviewcycle/teamgoals', '/projects/addactivities', '/analyticsdashboard',

    '/invoice/ViewInvoices', '/pmoTimeSheetEntry', '/invoice-update-softex', '/invoice/missingTimesheetApprovers', '/isr-registrations', '/isr-event-definitions', '/estimations/project-estimations', '/isr-event-report',

    '/build-history', '/irecruit/evaluation', '/irecruit/candidates', '/irecruit/dashboard', '/irecruit/scheduled', '/irecruit/candidates/addprofile', '/irecruit/requests',

    // The below 4 urls do not have any references any where in a7 or a1 code

    '/reports/Expenses', '/reports/Invoice', '/reports/P&L', '/reports/Timesheet',

    '/reviewcycle/talent-management', '/resignation/list'

  ];



  // These organizations allow an employee to apply for PTO even if available hours are insufficient

  public static INSUFFICIENT_PTO_ALLOWED_ORG_CODES = ['OSIUS', 'OSICAN'];

}