import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";

import { DateOnDashboard } from "../../shared/utilities/DateOnDashboard";

import { ActivatedRoute, Router } from "@angular/router";

import { GridOptions } from "ag-grid";

import { ViewExpensesService } from "../../shared/services/viewexpenses.service";

import { LeaveRequestService } from "../../shared/services/leaveRequest.service";

import { Flash } from '../../shared/utilities/flash';

import { EditExpensesService } from "../../shared/services/editexpense.service";

import { NavigateDataService } from "../../shared/services/navigateData.service";

declare var $: any;



enum StatusValues {

  approved = "O",

  rejected = "R",

  submitted = "S",

  open = "N",

  charged = "G",

  invoiced = "I",

  reversed = "U",

  reimbursed = "P"

}



@Component({

  selector: 'app-pmo-expense',

  templateUrl: './pmo-expense.component.html',

  styleUrls: ['./pmo-expense.component.css']

})

export class PmoExpenseComponent implements OnInit {



  @ViewChild('AlertSuccess') alertSuccess: ElementRef;

  @ViewChild('AlertError') alertError: ElementRef;

  @ViewChild('DatePickContainer1') datePickContainer1;

  @ViewChild('DatePickContainer2') datePickContainer2;

  @ViewChild('startDate') startDate;

  @ViewChild('endDate') endDate;



  dayData = { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" };



  private gridApi;

  private gridColumnApi;



  public columnDefs: any[];

  public rowData = [];



  public successAlert: boolean = false;

  public errorMessage: string;

  private RefData: any[];



  startDateSelectedDate;

  endDateSelectedDate;

  endDateMinVal;

  startDateString;

  endDateString;

  employeeList = [];

  employeeLength: boolean = false;

  fullName;

  employeeId = "";

  searchedText = '';

  public paginationPageSize: any;

  public rowSelection;

  private reportid;

  private status;

  flash: Flash = new Flash();

  isTrascError: boolean = false;

  allStartDate: string = '2018-9-1';

  allEndDate: string = '4712-12-31';

  selectedStatusExpense = "";

  searchReportId = "";

  reprtId: boolean = true;
  crdate: boolean = true;
  expnsDateRange: boolean = true;
  total: boolean = true;
  locatn: boolean = true;
  stats: boolean = true;
  chkbx: boolean = true;

  checkbox : Boolean = false;
  reportId : Boolean = false;
  submittedDate : Boolean = false;
  expenseweekDate : Boolean = false;
  totalAmount : Boolean = false;
  location : Boolean = false;
  Status : Boolean = false;
  qbStatus : Boolean = false;



  selectedDates: DateOnDashboard = new DateOnDashboard('all', 'All');

  listdates = [

    new DateOnDashboard('all', 'All'),

    new DateOnDashboard('thisWeek', 'This Week'),

    new DateOnDashboard('lastWeek', 'Last Week'),

    new DateOnDashboard('lastBiWeek', 'Last bi-week'),

    new DateOnDashboard('thisMonth', 'This Month'),

    new DateOnDashboard('lastMonth', 'Last Month'),

    new DateOnDashboard('thisYear', 'This Year'),

    new DateOnDashboard('dateRange', 'Date Range')

  ];



  itemsPerPageList = [5, 10, 20, 50, 100];

  currentPageItemCount = 10;



  constructor(private _viewExpensesService: ViewExpensesService, private router: Router, private route: ActivatedRoute,

    private _leaveRequestService: LeaveRequestService, private _editExpenseService: EditExpensesService,

    private _navigateDataService: NavigateDataService) {

    this.columnDefs = this.createColumnDefs();



  }



  ngOnInit() {



    this.paginationPageSize = 10;

    // this.getInitialExpensesByDateAndStatus();

    if (this._navigateDataService.pmoExpenseFilterSearchReportId != "") {

      let event = { keyCode: 13 };

      this.searchReportId = this._navigateDataService.pmoExpenseFilterSearchReportId;

      this.getExpensesByReportId(event);

    } else {

      this.employeeId = this._navigateDataService.pmoExpenseFilterEmpId;

      this.fullName = this._navigateDataService.pmoExpenseFilterEmpName;

      if (this._navigateDataService.pmoExpenseFilterSelectedDate == "dateRange") {

        this.selectedDates.id = this._navigateDataService.pmoExpenseFilterSelectedDate;

        this.startDateSelectedDate = this._navigateDataService.pmoExpenseDatePickerStartDate;

        this.endDateSelectedDate = this._navigateDataService.pmoExpenseDatePickerEndDate;

        this.startDateString = this._navigateDataService.pmoExpenseFilterStartDateString;

        this.endDateString = this._navigateDataService.pmoExpenseFilterEndDateString;

        this.getExpensesByDateAndStatus(this._navigateDataService.pmoExpenseFilterStatus, this._navigateDataService.pmoExpenseFilterSelectedDate, this._navigateDataService.pmoExpenseFilterStartDateString, this._navigateDataService.pmoExpenseFilterEndDateString, this.currentPageItemCount);

      } else {

        this.selectedDates.id = this._navigateDataService.pmoExpenseFilterSelectedDate;

        this.getExpensesByDateAndStatus(this._navigateDataService.pmoExpenseFilterStatus, this._navigateDataService.pmoExpenseFilterSelectedDate, "", "", this.currentPageItemCount);

      }

    }

  }



  startDateChangeFormat(event) {

    let startdate = event.day + "-" + this.dayData[event.month] + "-" + event.year;

    this.startDate.nativeElement.value = startdate;

  }



  endDateChangeFormat(event) {

    let enddate = event.day + "-" + this.dayData[event.month] + "-" + event.year;

    this.endDate.nativeElement.value = enddate;

  }



  getInitialExpensesByDateAndStatus() {

    this.status = "N";

    let selectedDate = this.selectedDates.id;

    this.getExpensesByDateAndStatus(this.status, selectedDate, "", "", this.currentPageItemCount)

  }



  getExpensesByDateAndStatus(status, selectedDate, startDateString, endDateString, itemCount) {

    this.selectedStatusExpense = status;

    this.searchReportId = "";

    this._navigateDataService.pmoExpenseFilterSearchReportId = "";

    this._navigateDataService.pmoExpenseFilterSelectedDate = selectedDate;

    this._navigateDataService.pmoExpenseFilterStatus = status;

    this._navigateDataService.pmoExpenseFilterEmpId = this.employeeId;

    this._navigateDataService.reportEmployeeId = this.employeeId;

    this._navigateDataService.pmoExpenseFilterEmpName = this.fullName;

    let urlData = "";

    if (selectedDate == "dateRange") {

      this._navigateDataService.pmoExpenseDatePickerStartDate = this.startDateSelectedDate;

      this._navigateDataService.pmoExpenseDatePickerEndDate = this.endDateSelectedDate;

      this._navigateDataService.pmoExpenseFilterStartDateString = this.startDateString;

      this._navigateDataService.pmoExpenseFilterEndDateString = this.endDateString;

      urlData = "status=" + status + "&startDate=" + this.startDateString + "&endDate=" + this.endDateString + "&selectedDateRange=&userId=" + this.employeeId + "&limitSize=" + itemCount;

    } else if (selectedDate == "all") {

      this._navigateDataService.pmoExpenseFilterStartDateString = "";

      this._navigateDataService.pmoExpenseFilterEndDateString = "";

      urlData = "status=" + status + "&startDate=" + this.allStartDate + "&endDate=" + this.allEndDate + "&selectedDateRange=&userId=" + this.employeeId + "&limitSize=" + itemCount;

    } else {

      this._navigateDataService.pmoExpenseFilterStartDateString = "";

      this._navigateDataService.pmoExpenseFilterEndDateString = "";

      urlData = "status=" + status + "&startDate=&endDate=&selectedDateRange=" + selectedDate + "&userId=" + this.employeeId + "&limitSize=" + itemCount;

    }



    this.rowData = [];

    //Calling View Expense Service to get the data. May need to call other service to get the data

    if (this.employeeId != "") {



      if (status === 'P') {

        this._viewExpensesService.getReimbursedExpenses(urlData).subscribe(response => {

          this.rowData = response;

          this.columnDefs = this.createReimburseColumnDefs();

        },

          error => this.errorMessage = <any>error);

      } else {

        this._viewExpensesService.getExpensesByDateAndStatus(urlData).subscribe(response => {

          this.rowData = response;

          this.columnDefs = this.createColumnDefs();

        },

          error => this.errorMessage = <any>error);

      }

    }

  }



  onSelectionChanged(event) { }



  getSelectedApprovalRows() {

    let selectedRows = this.gridApi.getSelectedNodes();



    if (selectedRows.length > 0 && (this.selectedStatusExpense == 'S' || this.selectedStatusExpense == 'R')) {

      $("#approve_expense_conf").modal('show');

    } else if (this.selectedStatusExpense != 'S' && this.selectedStatusExpense != 'R') {

      this.errorMessage = "Operation applicable only on SUBMITTED & REJECTED tabs";

      let ref = this;

      this.alertError.nativeElement.classList.add("show");

      setTimeout(function () {

        ref.alertError.nativeElement.classList.remove("show");

      }, 3000);

    } else {

      this.errorMessage = "Please select atleast one expense report";

      let ref = this;

      this.alertError.nativeElement.classList.add("show");

      setTimeout(function () {

        ref.alertError.nativeElement.classList.remove("show");

      }, 2000);

    }

  }



  approveRows() {

    let selectedRows = this.gridApi.getSelectedNodes();

    $('#loaderDisplayModal').modal('show');

    let reportIds = [];

    selectedRows.forEach(row => {

      reportIds.push(row.data.reportid);

    });



    this._editExpenseService.approvePmoExpenseFromReportPage(reportIds).subscribe(response => {

      $('#loaderDisplayModal').modal('hide');

      this.flash.message = "Expenses Approved Successfully";

      let ref = this;

      this.alertSuccess.nativeElement.classList.add("show");

      setTimeout(function () {

        ref.alertSuccess.nativeElement.classList.remove("show");

        ref.ngOnInit();

      }, 1500);

    }, error => {

      console.log(error);

      $('#loaderDisplayModal').modal('hide');

      this.errorMessage = "Error Occured While Approving Expenses";

      let ref = this;

      this.alertError.nativeElement.classList.add("show");

      setTimeout(function () {

        ref.alertError.nativeElement.classList.remove("show");

      }, 1500);



    });

  }

  onSelectColumn(val, fieldName) {
    this.gridColumnApi.setColumnsVisible([fieldName], val);

    switch (fieldName){ 
      case 'chkbx':  { 
        if(!val){
          this.checkbox = true; 
        }else{
          this.checkbox = false;
        }
         break; 
      } 
      case 'reportid': { 
        if(!val){
          this.reportId = true;
        }else{
          this.reportId = false;
        }
         break; 
      } 
      case 'submitedDate': {
        if(!val){
          this.submittedDate = true;
        }else{
          this.submittedDate = false;
        }
         break;    
      } 
      case 'expenseWeekDate': { 
        if(!val){
          this.expenseweekDate = true;
        }else{
          this.expenseweekDate = false;
        }
         break; 
      }  
      case 'totalAmount': { 
        if(!val){
          this.totalAmount = true;
        }else{
          this.totalAmount = false;
        }
        break; 
     }  
     case 'location': { 
      if(!val){
        this.location = true;
      }else{
        this.location = false;
      }
      break; 
    }  
     case 'status': { 
      if(!val){
        this.Status = true;
      }else{
        this.Status = false;
      }
      break; 
    }
    case 'qbstatus': { 
      if(!val){
        this.qbStatus = true;
      }else{
        this.qbStatus = false;
      }
      break; 
    }        
   }
  }

  private createColumnDefs() {

    const columnDefs = [
      {
        headerName: "",

        suppressSizeToFit: true,

        width: 45,

        autoHeight: true,

        hide: this.checkbox,

        headerCheckboxSelection: true,

        headerCheckboxSelectionFilteredOnly: true,

        checkboxSelection: true,

        field: "chkbx",

        cellStyle: { fontSize: '15px' }
      },
      {
        headerName: "Report Id",

        field: "reportid",

        width: 110,

        autoHeight: true,

        hide: this.reportId,

      },
      {
        headerName: "Created Date",

        field: "submitedDate",

        filter: 'date',

        width: 180,

        autoHeight: true,

        hide: this.submittedDate,

      }, {
        headerName: "Expense Date Range",

        field: "expenseWeekDate",

        filter: 'date',

        suppressFilter: true,

        width: 290,

        autoHeight: true,

        hide: this.expenseweekDate,
      },
      {
        headerName: "Total",

        field: "totalAmount",

        suppressFilter: true,

        width: 150,

        autoHeight: true,

        hide : this.totalAmount,

        valueFormatter: function (params) {

          let numVal = Number(params.value.split(" ")[1]);

          return params.value.split(" ")[0] + ' ' + numVal.toFixed(2);

        }
      },
      {
        headerName: "Location",

        field: "location",

        suppressFilter: true,

        width: 160,

        autoHeight: true,

        hide : this.location

      },
      {

        headerName: "Status",

        field: "status",

        filter: 'status',

        width: 160,

        autoHeight: true,

        hide : this.Status


      },
      {

        headerName: 'QB Status',

        field: 'qbStatus',

        filter: 'status',

        width: 110,

        autoHeight: true

      }
    ];
    this.rowSelection = "multiple";
    return columnDefs;
  }



  onGridReady(params) {

    this.gridApi = params.api;

    this.gridColumnApi = params.columnApi;

  }



  getEmployeeList(event) {



    this.employeeId = '';

    this.employeeLength = false;

    if (this.searchReportId == "" && this.employeeId == "") {

      this.rowData = [];

    }

    let mailId = event.target.value;

    if ((event.keyCode == 13 || event.type == "blur") && mailId != "") {

      // event.target.blur();      



      this.employeeList = [];



      this._leaveRequestService.getMailSuggestion(mailId).subscribe

        (response => {

          this.employeeList = response;



          if (this.employeeList.length > 1) {

            event.target.value = '';

            $('#employeeList').modal({ show: true });

          }

          else if (this.employeeList.length === 0) {

            this.employeeLength = true;

          }

          else {

            event.target.value = '';

            this.fullName = this.employeeList[0].fullName;

            this.employeeId = this.employeeList[0].employeeId;

            this.getExpensesByDateAndStatus(this.selectedStatusExpense, this.selectedDates.id, this.startDateString, this.endDateString, this.currentPageItemCount)

          }

        })

    }

  }



  selectedEmployee(selectedData, employeeId) {

    this.fullName = selectedData;

    this.employeeId = employeeId;

    this.getExpensesByDateAndStatus(this.selectedStatusExpense, this.selectedDates.id, this.startDateString, this.endDateString, this.currentPageItemCount)

    $('#employeeList').modal('hide');

  }



  filteredEmployeeSearch(search) {

    this.searchedText = search;

    this._leaveRequestService.getMailSuggestion(this.searchedText).subscribe

      (response => {

        this.employeeList = response;

      })

    this.searchedText = ''

  }



  onSelect(daterange: string) {

    if (daterange != 'dateRange') {

      this.startDateString = "";

      this.endDateString = "";

      this.startDateSelectedDate = { year: Number(), month: Number(), day: Number() };

      this.endDateSelectedDate = { year: Number(), month: Number(), day: Number() };

      this.getExpensesByDateAndStatus(this.selectedStatusExpense, daterange, "", "", this.currentPageItemCount);

    } else if (daterange.toString() == 'all') {

      this.dateRangeMethod(this.allStartDate, this.allEndDate);

    }

  }



  checkStartDate() {

    this.endDateMinVal = this.startDateSelectedDate;

    if (this.endDateSelectedDate != undefined && this.endDateSelectedDate.year != 0) {

      let endDateString = this.endDateSelectedDate.year + '-' + this.endDateSelectedDate.month + '-' + this.endDateSelectedDate.day;

      let startDateString = this.startDateSelectedDate.year + '-' + this.startDateSelectedDate.month + '-' + this.startDateSelectedDate.day;

      this.dateRangeMethod(startDateString, endDateString);

    }



  }



  endDateSelected() {

    if (this.startDateSelectedDate != undefined && this.startDateSelectedDate.year != 0) {

      let endDateString = this.endDateSelectedDate.year + '-' + this.endDateSelectedDate.month + '-' + this.endDateSelectedDate.day;

      let startDateString = this.startDateSelectedDate.year + '-' + this.startDateSelectedDate.month + '-' + this.startDateSelectedDate.day;

      this.dateRangeMethod(startDateString, endDateString);

    }



  }



  dateRangeMethod(startDateString, endDateString) {

    this.startDateString = startDateString;

    this.endDateString = endDateString;

    this.getExpensesByDateAndStatus(this.selectedStatusExpense, "dateRange", this.startDateString, this.endDateString, this.currentPageItemCount);

  }



  onRowSelected(event) {

    this.reportid = event.node.data.reportid;

    this.router.navigate(['../pmo-manage-expenses', this.reportid, event.node.data.status], { relativeTo: this.route });

  }



  statusBasedExpenses(event, status) {

    this.selectedStatusExpense = status;

    this.status = status;

    if (this.employeeId != '' && this.employeeId != null)

      this.getExpensesByDateAndStatus(status, this.selectedDates.id, "", "", this.currentPageItemCount);

    else {

      let ref = this;

      this.isTrascError = true;

      this.errorMessage = 'Select UserName';

      this.alertError.nativeElement.classList.add("show");



      setTimeout(() => {

        ref.isTrascError = false;

        ref.alertError.nativeElement.classList.remove("show");

      }, 900);



    }

  }



  getExpensesByReportId(event) {

    if (this.searchReportId == "" && this.employeeId == "") {

      this.rowData = [];

    }

    if ((event.keyCode == 13 || event.type == "blur") && this.searchReportId != "") {

      this.startDateSelectedDate = {};

      this.endDateSelectedDate = {};

      this.startDateString = "";

      this.endDateString = "";

      this._navigateDataService.pmoExpenseFilterSearchReportId = this.searchReportId;

      this.employeeId = "";

      this.fullName = "";

      this.selectedDates.id = "all";

      this._editExpenseService.getExpenseReportBasedOnReportId(this.searchReportId).subscribe(response => {

        this.rowData = response;

        this.status = this.rowData[0].status;

        this.selectedStatusExpense = StatusValues[this.status.toLowerCase()];

        this._navigateDataService.pmoExpenseFilterStatus = this.selectedStatusExpense;

        this._navigateDataService.reportEmployeeId = this.rowData[0].employeeId;

        if (this.rowData.length > 0 && this.rowData[0].status == "Reimbursed") {

          this.columnDefs = this.createReimburseColumnDefs();

        } else {

          this.columnDefs = this.createColumnDefs();

        }
      }, error => {

        let ref = this;

        this.isTrascError = true;

        this.errorMessage = 'Expenses Not Found';

        this.alertError.nativeElement.classList.add("show");



        setTimeout(() => {

          ref.isTrascError = false;

          ref.alertError.nativeElement.classList.remove("show");

        }, 2500);

      })

    }

  }




  private createReimburseColumnDefs() {

    const columnDefs = [

      {

        headerName: "Report Id",

        field: "reportid",

        width: 110,

        autoHeight: true

      },

      {

        headerName: "Created Date",

        field: "submitedDate",

        filter: 'date',

        width: 130,

        autoHeight: true

      }, {

        headerName: "Expense Date Range",

        field: "expenseWeekDate",

        filter: 'date',

        suppressFilter: true,

        width: 240,

        autoHeight: true

      },

      {

        headerName: "Total Amount",

        field: "totalAmount",

        suppressFilter: true,

        width: 150,

        autoHeight: true,

        valueFormatter: function (params) {

          if (params.value) {

            let numVal = Number(params.value.split(" ")[1]);

            return params.value.split(" ")[0] + ' ' + numVal.toFixed(2);

          }



        }

      },

      {

        headerName: "Reimbursible Amount",

        field: "totalReimburseAmount",

        suppressFilter: true,

        width: 180,

        autoHeight: true,

        valueFormatter: function (params) {

          if (params.value) {

            let numVal = Number(params.value.split(" ")[1]);

            return params.value.split(" ")[0] + ' ' + numVal.toFixed(2);

          }

        }



      },

      {

        headerName: "Balance Amount",

        field: "balanceAmount",

        suppressFilter: true,

        width: 160,

        autoHeight: true,

        valueFormatter: function (params) {

          if (params.value) {

            let numVal = Number(params.value.split(" ")[1]);

            return params.value.split(" ")[0] + ' ' + numVal.toFixed(2);

          }



        }

      },

      {

        headerName: "Status",

        field: "status",

        filter: 'status',

        width: 110,

        autoHeight: true

      },

      {

        headerName: 'QB Status',

        field: 'qbStatus',

        filter: 'status',

        width: 110,

        autoHeight: true

      }

    ];

    this.rowSelection = "multiple";

    return columnDefs;

  }



  closeFix1(event, datePicker) {

    if (!this.datePickContainer1.nativeElement.contains(event.target)) { // check click origin

      datePicker.close();

    }

  }



  closeFix2(event, datePicker) {

    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin

      datePicker.close();

    }

  }



  chengePageSize(itemCount) {

    this.currentPageItemCount = itemCount;

    let selectedDate = this.selectedDates.id;

    this.getExpensesByDateAndStatus(this.status, selectedDate, "", "", itemCount)



  }



}