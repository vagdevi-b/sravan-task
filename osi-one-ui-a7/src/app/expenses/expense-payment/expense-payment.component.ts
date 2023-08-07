import { NavigateDataService } from './../../shared/services/navigateData.service';
import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import { DateOnDashboard } from "../../shared/utilities/DateOnDashboard";
import { ActivatedRoute, Router } from "@angular/router";
import { GridOptions } from "ag-grid";
import { ViewExpensesService } from "../../shared/services/viewexpenses.service";
import { LeaveRequestService } from "../../shared/services/leaveRequest.service";
import { Flash } from '../../shared/utilities/flash';
import { EditExpensesService } from "../../shared/services/editexpense.service";
import { ReimburseExpenseService } from '../../shared/services/reimburseExpense.service';

class PayDetail {
  reportId?= '';
  baseExchangeCurrency?= '';
  paymentDate?= '';
  description?= '';
  refNo?= '';
  amount?: Number;
  constructor(reportId, baseExchangeCurrency, paymentDate, description, refNo, amount) {
    this.reportId = reportId;
    this.baseExchangeCurrency = baseExchangeCurrency;
    this.paymentDate = paymentDate;
    this.description = description;
    this.refNo = refNo;
    this.amount = amount;
  }
}

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
  selector: 'app-expense-payment',
  templateUrl: './expense-payment.component.html',
  styleUrls: ['./expense-payment.component.css']
})
export class ExpensePaymentComponent implements OnInit {
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
  paymentDetailsFields = [];
  formError: Boolean = false;
  successTextMessage = '';
  showSuccessAlert = false;
  alertText;
  //Setting the min date to today as payment has to be made in future
  minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  selectedDates: DateOnDashboard = new DateOnDashboard('all', 'All');
  listdates = [
    new DateOnDashboard('all', 'All'),
    new DateOnDashboard('thisWeek', 'This Week'),
    new DateOnDashboard('lastWeek', 'Last Week'),
    new DateOnDashboard('lastBiWeek', 'Last bi-week'),
    new DateOnDashboard('thisMonth', 'This Month'),
    new DateOnDashboard('lastMonth', 'Last Month'),
    new DateOnDashboard('dateRange', 'Date Range')
  ];

  itemsPerPageList = [5, 10, 20, 50, 100];
  currentPageItemCount = 10;

  constructor(private _viewExpensesService: ViewExpensesService, private router: Router, private route: ActivatedRoute,
    private _leaveRequestService: LeaveRequestService, private _editExpenseService: EditExpensesService,
    private _navigateDataService: NavigateDataService, private _reimburseExpense: ReimburseExpenseService, ) {
    this.columnDefs = this.createColumnDefs();

  }

  ngOnInit() {

    this.paginationPageSize = 10;
    // this.getInitialExpensesByDateAndStatus();
    if (this._navigateDataService.pmoFilterSearchReportId != "") {
      let event = { keyCode: 13 };
      this.searchReportId = this._navigateDataService.pmoFilterSearchReportId;
      this.getExpensesByReportId(event);
    } else {
      this.employeeId = this._navigateDataService.pmoFilterEmpId;
      this.fullName = this._navigateDataService.pmoFilterEmpName;
      if (this._navigateDataService.pmoFilterSelectedDate == "dateRange") {
        this.selectedDates.id = this._navigateDataService.pmoFilterSelectedDate;
        this.startDateSelectedDate = this._navigateDataService.pmoDatePickerStartDate;
        this.endDateSelectedDate = this._navigateDataService.pmoDatePickerEndDate;
        this.startDateString = this._navigateDataService.pmoFilterStartDateString;
        this.endDateString = this._navigateDataService.pmoFilterEndDateString;
        this.getExpensesByDateAndStatus(this._navigateDataService.pmoFilterStatus, this._navigateDataService.pmoFilterSelectedDate, this._navigateDataService.pmoFilterStartDateString, this._navigateDataService.pmoFilterEndDateString, this.currentPageItemCount);
      } else {
        this.selectedDates.id = this._navigateDataService.pmoFilterSelectedDate;
        this.getExpensesByDateAndStatus(this._navigateDataService.pmoFilterStatus, this._navigateDataService.pmoFilterSelectedDate, "", "", this.currentPageItemCount);
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
    // this.status = status;
    this.selectedStatusExpense = status;
    this.searchReportId = "";
    this._navigateDataService.pmoFilterSearchReportId = "";
    this._navigateDataService.pmoFilterSelectedDate = selectedDate;
    this._navigateDataService.pmoFilterStatus = status;
    this._navigateDataService.pmoFilterEmpId = this.employeeId;
    this._navigateDataService.pmoFilterEmpName = this.fullName;
    let urlData = "";
    if (selectedDate == "dateRange") {
      this._navigateDataService.pmoDatePickerStartDate = this.startDateSelectedDate;
      this._navigateDataService.pmoDatePickerEndDate = this.endDateSelectedDate;
      this._navigateDataService.pmoFilterStartDateString = this.startDateString;
      this._navigateDataService.pmoFilterEndDateString = this.endDateString;
      urlData = "status=" + status + "&startDate=" + this.startDateString + "&endDate=" + this.endDateString + "&selectedDateRange=&userId=" + this.employeeId + "&limitSize=" + itemCount;
    } else if (selectedDate == "all") {
      this._navigateDataService.pmoFilterStartDateString = "";
      this._navigateDataService.pmoFilterEndDateString = "";
      urlData = "status=" + status + "&startDate=" + this.allStartDate + "&endDate=" + this.allEndDate + "&selectedDateRange=&userId=" + this.employeeId + "&limitSize=" + itemCount;
    } else {
      this._navigateDataService.pmoFilterStartDateString = "";
      this._navigateDataService.pmoFilterEndDateString = "";
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

  getSelectedReimbursementRows() {
    let selectedRows = this.gridApi.getSelectedNodes();
    this.paymentDetailsFields = [];
    if (selectedRows.length > 0 && this.selectedStatusExpense == 'O') {
      selectedRows.forEach(row => {
        this.paymentDetailsFields.push(new PayDetail(row.data.reportid, row.data.totalAmount.split(" ")[0], '', '', '', row.data.totalAmount.split(" ")[1]));
      });
      $("#reimburseModal").modal('show');
    } else if (this.selectedStatusExpense != 'O') {
      this.errorMessage = "Operation applicable only on Approved tab";
      let ref = this;
      this.alertError.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 3000);
    } else {
      this.errorMessage = "No rows selected for reimbursement";
      let ref = this;
      this.alertError.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 2000);
    }
  }

  savePaymentDetails() {
    // $("#reimburseModal").modal('hide');
    // $('#loaderDisplayModal').modal('show');
    let isValidated = false;
    isValidated = this.paymentDetailsFields.every(x => this.validateFields(x));
    let tmpDataArray;
    if (isValidated) {
      tmpDataArray = this.paymentDetailsFields.map(x => Object.assign({}, x));
      tmpDataArray.forEach(field => {
        field.paymentDate = field.paymentDate['year'] + '-' + field.paymentDate['month'] + '-' + field.paymentDate['day'];
      });
    }
    this._reimburseExpense.reimburseExpenseReportPage(tmpDataArray).subscribe(expensesLst => {
      this.successTextMessage = "Expense Item Reimbursed Successfully"
      this.showSuccessAlert = true;
      if (expensesLst !== null) {
        this.isTrascError = true;
        this.flash.message = 'Expense Reports Reimbursed Successfully';
        this.flash.type = 'success';
        let ref = this;
        this.alertSuccess.nativeElement.classList.add("show");
        setTimeout(() => {
          ref.isTrascError = false;
          ref.alertSuccess.nativeElement.classList.remove("show");

          ref.ngOnInit();
        }, 2000);
      }
      $('#reimburseModal').modal('hide');

    },
      // error => {
      //   $('#loaderDisplayModal').modal('hide');
      //   this.errorMessage = "Error occured while reimbursing reports";
      //   this.alertError.nativeElement.classList.add("show");
      //   let ref = this;
      //   setTimeout(function () {
      //     ref.alertError.nativeElement.classList.remove("show");
      //     ref.ngOnInit();
      //   }, 2000);
      // }
      error => {
        $('#loaderDisplayModal').modal('hide');
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
          ref.ngOnInit();
        }, 1000);
      });

    $('#loaderDisplayModal').modal('hide');
  }

  validateFields(payDetail) { //Validation for the textboxes in the modal
    if (payDetail.paymentDate == "") {
      this.formError = true;
      this.alertText = "Please select payment date.";
      let ref = this;
      setTimeout(function () {
        ref.formError = false,
          this.alertText = "";
      }, 1000);
      return false;
    } else if (payDetail.description == "") {
      this.formError = true;
      this.alertText = "Please add description.";
      let ref = this;
      setTimeout(function () {
        ref.formError = false,
          this.alertText = "";
      }, 1000);
      return false;
    } else if (payDetail.refNo == "") {
      this.formError = true;
      this.alertText = "Please add reference number.";
      let ref = this;
      setTimeout(function () {
        ref.formError = false,
          this.alertText = "";
      }, 1000);
      return false;
    } else {
      return true;
    }
  }

  trackByFn(index, item) {
    return index;
  }

  private createColumnDefs() {
    const columnDefs = [
      {
        headerName: "",
        suppressSizeToFit: true,
        width: 45,
        autoHeight: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        cellStyle: { fontSize: '15px' }
      },
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
        width: 180,
        autoHeight: true
      }, {
        headerName: "Expense Date Range",
        field: "expenseWeekDate",
        filter: 'date',
        suppressFilter: true,
        width: 290,
        autoHeight: true
      },
      {
        headerName: "Total",
        field: "totalAmount",
        suppressFilter: true,
        width: 150,
        autoHeight: true,
        valueFormatter: function (params) {
          let numVal = Number(params.value.split(" ")[1]);
          return params.value.split(" ")[0] + ' ' + numVal.toFixed(2);
        }

      },
      // {
      //   headerName: "Department",
      //   field: "department",
      //   suppressFilter: true,
      //   width: 110,
      //   autoHeight: true
      // },
      {
        headerName: "Location",
        field: "location",
        suppressFilter: true,
        width: 160,
        autoHeight: true
      },
      {
        headerName: "Status",
        field: "status",
        filter: 'status',
        width: 195,
        autoHeight: true
      },


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
        // this.suggestedMailId = response;
      })
    this.searchedText = ''
  }

  onSelect(daterange: string) {
    if (daterange != 'dateRange') {
      this.startDateString = "";
      this.endDateString = "";
      this.startDateSelectedDate = { year: Number(), month: Number(), day: Number() };
      this.endDateSelectedDate = { year: Number(), month: Number(), day: Number() };
      this.getExpensesByDateAndStatus(this.status, daterange, "", "", this.currentPageItemCount);
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
    if (event.node.selected && event.node.data.status.toLowerCase() == "approved") { //Redirect only for approved expenses 
      this.status = "O";
      this.router.navigate(['../expense-details', this.reportid, event.node.data.status], { relativeTo: this.route });
    } else if (event.node.selected && event.node.data.status.toLowerCase() == "reimbursed") {
      this.status = "P";
      this.router.navigate(['../pmo-reimbursed-expense', this.reportid, event.node.data.status], { relativeTo: this.route });
    }
  }

  onSelectionChanged(event) {

  }

  statusBasedExpenses(event, status) {
    this.selectedStatusExpense = status;
    // var target = event.target || event.srcElement || event.currentTarget;
    // var x = document.getElementsByClassName("btn");
    // var i;
    // for (i = 0; i < x.length; i++) {
    //   x[i].classList.remove("active");
    // }
    // document.getElementById(target.attributes.id.nodeValue).classList.add('active');
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
      this._navigateDataService.pmoFilterSearchReportId = this.searchReportId;
      this.employeeId = "";
      this.fullName = "";
      this.selectedDates.id = "all";
      this._editExpenseService.getExpenseReportBasedOnReportId(this.searchReportId).subscribe(response => {
        this.rowData = response;
        this.status = this.rowData[0].status;
        this.selectedStatusExpense = StatusValues[this.status.toLowerCase()];
        this._navigateDataService.pmoFilterStatus = this.selectedStatusExpense;
        if (this.rowData.length > 0 && this.rowData[0].status == "Reimbursed") {
          this.columnDefs = this.createReimburseColumnDefs();
        } else {
          this.columnDefs = this.createColumnDefs();
        }

      },
        error => {
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
      // {
      //   headerName: "Department",
      //   field: "department",
      //   suppressFilter: true,
      //   width: 110,
      //   autoHeight: true
      // },
      {
        headerName: "Status",
        field: "status",
        filter: 'status',
        width: 110,
        autoHeight: true
      },


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
